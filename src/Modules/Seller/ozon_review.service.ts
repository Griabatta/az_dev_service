import { Body, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { subMonths } from 'date-fns';
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

  // Получение отзывов из Ozon API v1
  async getReviews(
    headers: headerDTO,
    @Body() body?: {
      last_id?: string;
      limit?: number;
      sort_dir?: 'ASC' | 'DESC';
      status?: 'ALL' | 'PROCESSED' | 'UNPROCESSED';
    }
  ) {
    const url = 'https://api-seller.ozon.ru/v1/review/list';
    const { clientId, apiKey, userId } = headers;
  
    if (!clientId || !apiKey || !userId) {
      await this.errors.logUnauthorizedError(Number(userId));
      return 'Unauthorized: Missing Client-Id or Api-Key';
    }
  
    // Валидация limit (20-100)
    // const validatedLimit = Math.min(Math.max(20, body?.limit || 100), 100);
  
    const requestBody = {
      last_id: body?.last_id || "",
      limit: 100,
      sort_dir: body?.sort_dir || 'DESC', 
      status: body?.status || 'PROCESSED' 
    };
  
    const httpHeaders = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await axios.post(url, requestBody, { 
        headers: httpHeaders,
        timeout: 10000
      });
  
      if (!response.data?.result?.reviews) {
        throw new Error('Invalid response structure from Ozon API');
      }
  
      return response.data.result.reviews.map(review => 
        this.mapOzonReviewToDto(review, Number(userId))
      );
  
    } catch (error) {
      await this.handleReviewError(error, Number(userId));
      
      this.logger.error(`Request details: ${JSON.stringify({
        url,
        body: requestBody,
        error: error.response?.data || error.message
      })}`);
      
      return error.response?.data?.message || error.message;
    }
  }
  
  // Обновленный метод для получения всех отзывов
  async getFullReviews(headers: headerDTO) {
    const REVIEW_LIST_URL = 'https://api-seller.ozon.ru/v1/review/list';
    const REVIEW_INFO_URL = 'https://api-seller.ozon.ru/v1/review/info';
    const { clientId, apiKey, userId } = headers;
    
    let allReviews:any = [];
    let lastId = "";
    let hasMore = true;
    let requestCount = 0;
    const MAX_REQUESTS = 50; // Защита от бесконечного цикла
  
    // 1. Получаем список всех отзывов
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

        // Проверяем структуру ответа
        if (!response.data?.reviews || !Array.isArray(response.data.reviews)) {
          throw new Error('Invalid response structure from reviews list');
        }
  
        allReviews = [...allReviews, ...response.data.reviews];
        hasMore = response.data.has_next;
        lastId = response.data.reviews[response.data.reviews.length - 1]?.id || "";
        requestCount++;
  
        // Задержка между запросами списка
        if (hasMore) await new Promise(resolve => setTimeout(resolve, 500));
  
      } catch (error) {
        this.logger.error(`Failed to get reviews list: ${error.message}`);
        throw error;
      }
    }
  
    // 2. Получаем детали для каждого отзыва
    const detailedReviews:any = [];
    const BATCH_SIZE = 10; // Размер пачки для детализации
    const DELAY_BETWEEN_BATCHES = 1000; // 1 секунда между пачками
  
    for (let i = 0; i < allReviews.length; i += BATCH_SIZE) {
      try {
        const batch = allReviews.slice(i, i + BATCH_SIZE);
        const batchDetails = await Promise.all(
          batch.map(review => 
            axios.post(REVIEW_INFO_URL, {
              review_id: review.id // Именно такой формат запроса
            }, {
              headers: {
                'Client-Id': clientId,
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
              }
            }).then(res => res.data?.reviews)
              .catch(e => {
                this.logger.warn(`Failed to get details for review ${review.id}: ${e.message}`);
                return null;
              })
          )
        );
  
        // Собираем результаты
        batch.forEach((review, index) => {
          if (batchDetails[index]) {
            detailedReviews.push({
              ...review,
              details: batchDetails[index]
            });
          }
        });
  
        // Задержка между пачками
        if (i + BATCH_SIZE < allReviews.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
  
      } catch (error) {
        this.logger.error(`Failed to process batch ${i}-${i+BATCH_SIZE}: ${error.message}`);
      }
    }
  
    return detailedReviews.map(async review => {
      const baseReview = await this.mapApiReviewToModel(review);
      
      // Добавляем детали из review.info если они есть
      if (review.details) {
        return {
          ...baseReview,
          ...await this.mapApiReviewToModel(review.details)
        };
      }
      
      return baseReview;
    });
  };

  async mapApiReviewToModel(apiReview: any): Promise<ReviewModel> {
    return {
      comments_amount: apiReview.comments_amount || 0,
      dislikes_amount: apiReview.dislikes_amount || 0,
      id: apiReview.id?.toString() || '',
      is_rating_participant: Boolean(apiReview.is_rating_participant),
      likes_amount: apiReview.likes_amount || 0,
      order_status: apiReview.order_status || 'unknown',
      photos: JSON.stringify(apiReview.photos || []),
      photos_amount: apiReview.photos_amount || (apiReview.photos?.length || 0),
      published_at: apiReview.published_at ? new Date(apiReview.published_at) : new Date(),
      rating: apiReview.rating || 0,
      sku: apiReview.sku || 0,
      status: apiReview.status || 'unknown',
      text: apiReview.text || '',
      videos: JSON.stringify(apiReview.videos || []),
      videos_amount: apiReview.videos_amount || (apiReview.videos?.length || 0)
    };
  }

  private mapOzonReviewToDto(ozonReview: any, userId: number) {
    return {
      ozonReviewId: ozonReview.id.toString(),
      productName: ozonReview.product_name,
      article: ozonReview.sku.toString(),
      sku: ozonReview.sku.toString(),
      reviewDate: new Date(ozonReview.created_at),
      rating: ozonReview.rating,
      reviewText: ozonReview.text,
      photoCount: ozonReview.photos?.length || 0,
      videoCount: ozonReview.videos?.length || 0,
      isRewarded: ozonReview.is_rated || false,
      rewardAmount: ozonReview.reward_points || 0,
      rewardDate: ozonReview.is_rated ? new Date() : undefined,
      commission: this.calculateCommission(ozonReview),
      totalAmount: (ozonReview.reward_points || 0) + this.calculateCommission(ozonReview),
      reviewUrl: `https://www.ozon.ru/product/review/${ozonReview.id}`,
      productId: this.getProductId(ozonReview.sku), // Нужно реализовать поиск productId по SKU
      userId
    };
  }

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
  async importReviews(userId: number, reviews: ReviewModel[]) {
    if (!reviews?.length) {
      this.logger.log('No reviews to import');
      return true;
    }

    try {
      await this.prisma.$transaction(
        reviews.map(review => 
          this.prisma.productReview.upsert({
            where: { reviewId: review.id, userId },
            create: {
              comments_amount: review.comments_amount,
              dislikes_amount: review.dislikes_amount,
              is_rating_participant: review.is_rating_participant,
              likes_amount: review.likes_amount,
              order_status: review.order_status,
              photos: review.photos,
              photos_amount: review.photos_amount,
              published_at: review.published_at,
              rating: review.rating,
              sku: review.sku,
              status: review.status,
              text: review.text,
              videos: review.videos,
              videos_amount: review.videos_amount,
              userId: userId,
              reviewId: review.id
            },
            update: {
              comments_amount: review.comments_amount,
              dislikes_amount: review.dislikes_amount,
              is_rating_participant: review.is_rating_participant,
              likes_amount: review.likes_amount,
              order_status: review.order_status,
              photos: review.photos,
              photos_amount: review.photos_amount,
              rating: review.rating,
              status: review.status,
              text: review.text,
              videos: review.videos,
              videos_amount: review.videos_amount
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
  async fetchAndImportReviews() {
    const users = await this.prisma.user.findMany();

    for (const user of users) {
      try {
        const clientId = await decrypt(user.clientId);
        const apiKey = await decrypt(user.apiKey);

        const reviews = await this.getFullReviews(
          { clientId, apiKey, userId: String(user.id) }
        );

        if (typeof reviews !== 'string') {
          await this.importReviews(user.id, reviews);
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit

      } catch (error) {
        if (error.response?.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        this.logger.error(`User ${user.id} error: ${error.message}`);
      }
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