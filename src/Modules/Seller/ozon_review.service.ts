import {  Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { decrypt } from 'src/tools/data.crypt';
import { ReviewModel } from './models/review.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { JournalErrorsService } from '../Errors/errors.service';
import { headerDTO } from './models/seller.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errors: JournalErrorsService
  ) {}

  private readonly logger = new Logger(ReviewService.name);

  
  async getFullReviews(headers: headerDTO) {
    const REVIEW_LIST_URL = 'https://api-seller.ozon.ru/v1/review/list';
    const { clientId, apiKey, userId } = headers;
    
    let allReviews:any = [];
    let lastId = "";
    let hasMore = true;
    let requestCount = 0;
    const MAX_REQUESTS = 50; 
  
    while (hasMore && requestCount < MAX_REQUESTS) {
      try {
        const response = await axios.post(REVIEW_LIST_URL, {
          last_id: lastId,
          limit: 100,
          sort_dir: 'DESC',
          status: 'PROCESSED'
        }, {
          headers: {
            'Client-Id': clientId,
            'Api-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });

        if (!response.data?.reviews || !Array.isArray(response.data.reviews)) {
          throw new Error('Invalid response structure from reviews list');
        }
  
        allReviews = [...allReviews, ...response.data.reviews];
        hasMore = response.data.has_next;
        lastId = response.data.reviews[response.data.reviews.length - 1]?.id || "";
        requestCount++;
  
        if (hasMore) await new Promise(resolve => setTimeout(resolve, 500));
  
      } catch (error) {
        this.logger.error(`Failed to get reviews list: ${error.message}`);
        throw error;
      }
    }
    
    this.logger.debug(Object.keys(allReviews[0]))
    
  
    return allReviews
  };

  async mapApiReviewToModel(apiReview: any, userId): Promise<ReviewModel> {
    return {
      reviewId:               apiReview.reviewId,
      comments_amount:        apiReview.comments_amount,
      is_rating_participant:  apiReview.is_rating_participant,
      order_status:           apiReview.order_status,
      photos_amount:          apiReview.photos_amount,
      published_at:           apiReview.published_at,
      rating:                 apiReview.rating,
      sku:                    apiReview.sku,
      status:                 apiReview.status,
      text:                   apiReview.text,
      videos_amount:          apiReview.videos_amount,
      userId:                 userId,
    };
  }

  // private mapOzonReviewToDto(ozonReview: any, userId: number) {
  //   return {
  //     ozonReviewId: ozonReview.id.toString(),
  //     productName: ozonReview.product_name,
  //     article: ozonReview.sku.toString(),
  //     sku: ozonReview.sku.toString(),
  //     reviewDate: new Date(ozonReview.created_at),
  //     rating: ozonReview.rating,
  //     reviewText: ozonReview.text,
  //     photoCount: ozonReview.photos?.length || 0,
  //     videoCount: ozonReview.videos?.length || 0,
  //     isRewarded: ozonReview.is_rated || false,
  //     rewardAmount: ozonReview.reward_points || 0,
  //     rewardDate: ozonReview.is_rated ? new Date() : undefined,
  //     commission: this.calculateCommission(ozonReview),
  //     totalAmount: (ozonReview.reward_points || 0) + this.calculateCommission(ozonReview),
  //     reviewUrl: `https://www.ozon.ru/product/review/${ozonReview.id}`,
  //     productId: this.getProductId(ozonReview.sku), // Нужно реализовать поиск productId по SKU
  //     userId
  //   };
  // }

  private async handleReviewError(error: any, userId: number) {
    // await this.errors.logError({
    //   userId,
    //   message: error.message || 'Failed to fetch reviews',
    //   priority: 3,
    //   code: error.response?.status || '500',
    //   serviceName: 'Seller/Reviews/request'
    // });
    this.logger.error(`Review fetch error: ${error.message}`);
  }

  // Импорт отзывов в БД
  async importReviews(userId: number, reviews) {
    if (!reviews?.length) {
      this.logger.log('No reviews to import');
      return true;
    }
    const products = await this.prisma.product_List.findMany({
      where: {
        userId: userId
      }
    })
    if (!products?.length) {
      this.logger.log('No product');
      return true;
    }

    
    const productMap = {};
    products.forEach(product => {
      productMap[product.product_id] = product;
    });

    reviews.forEach(review => {
      const product = productMap[review.product_id];
      if (product) {
        review.offer_id = product.offer_id; 
      } else {
        reviews.delete(review)
      }
    });

    try {
      await this.prisma.$transaction(
        reviews.map(review => 
          this.prisma.productReview.upsert({
            where: { 
              Review_user_review_date: {
                reviewId: review.id,
                userId: userId,
                published_at: review.published_at
              }
            },
            create: {
              reviewId:               review.id,
              comments_amount:        review.comments_amount,
              is_rating_participant:  review.is_rating_participant,
              order_status:           review.order_status,
              photos_amount:          review.photos_amount,
              published_at:           review.published_at,
              rating:                 review.rating,
              sku:                    review.sku,
              status:                 review.status,
              text:                   review.text,
              videos_amount:          review.videos_amount,
              userId:                 userId,
              ...review
            },
            update: {
              reviewId:               review.id,
              comments_amount:        review.comments_amount,
              is_rating_participant:  review.is_rating_participant,
              order_status:           review.order_status,
              photos_amount:          review.photos_amount,
              published_at:           review.published_at,
              rating:                 review.rating,
              sku:                    review.sku,
              status:                 review.status,
              text:                   review.text,
              videos_amount:          review.videos_amount,
              ...review
            }
          })
        )
      );
    } catch (error) {
      console.error('Failed to upsert reviews:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // Полный цикл получения и импорта
  async fetchAndImportReviews(user: any) {
    try {
      const clientId = await decrypt(user.clientId);
      const apiKey = await decrypt(user.apiKey);

      const reviews = await this.getFullReviews(
        { clientId, apiKey, userId: String(user.id) }
      );

      if (typeof reviews !== 'string') {
        await this.importReviews(user.id, reviews);
      }

      return true;
    } catch (error) {
      this.logger.error(`User ${user.id} error: ${error.message}`);
      return false;
    }
    
  }

  // Вспомогательные методы
  private calculateCommission(review: any): number {
    // Реализуйте расчет комиссии на основе вашей логики
    return 0;
  }

  private getProductId(sku: string): number {
    // Реализуйте поиск productId по SKU
    return 0;
  }
}