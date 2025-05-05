// performance/repositories/performance.repository.ts
import { Injectable } from '@nestjs/common';
import { CampaignTemplateDto } from '../models/performance.dto';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CampaignDto } from '../models/campaint.dto';
import { Prisma } from '@prisma/client';
import { isValid, startOfDay } from 'date-fns';

@Injectable()
export class PerformanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Токены
  

  async createCampaing(data: Prisma.CampaignTemplateCreateManyInput[]) {
    return this.prisma.campaignTemplate.createMany({
      data
    });
  }

  // async upsertmany(data: any[], userId: number) {
  //         return await this.prisma.$transaction(
  //             data.map(item => {
                
  //               const rawDate = item.createAt ? new Date(item.createAt) : new Date();
                
  //               if (!isValid(rawDate)) {
  //                 throw new Error(`Invalid date format: ${item.createAt}`);
  //               }
                
  //               const dateAtStartOfDay = startOfDay(rawDate);
          
  //               return this.prisma.campaignItem.upsert({
  //                 where: {
  //                   campaign_user_date_camp: {
  //                     userId,
  //                     campaignId: item.campaignId,
  //                     createdAtDB: dateAtStartOfDay
  //                   }
  //                 },
  //                 create: {
  //                     userId: userId,
  //                     createdAt: item.createAt,
  //                     ...item
  //                 },
  //                 update: {
  //                     userId: userId,
  //                   createAt: item.createAt,
  //                   ...item
  //                 }
  //               });
  //             })
  //           );
  //     }

  

  async getCampaignsByUserId(userId: number) {
    return this.prisma.campaignTemplate.findMany({
      where: { userId },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.performanceToken.findUnique({
      where: { userId }
    });
  }

  

  // async getTimeToken(userId: number) {
  //   return this.prisma.performanceToken.findUnique({
  //     where: {
  //       userId
  //     },
  //      select: {
  //       expiresAt: true
  //      }
  //   })
  // }

  async getCampaingsIds(userId: number) {
    return this.prisma.campaignTemplate.findMany({
      where: {userId},
      select: { campaignId: true }
    })
  }

  async getDataForExportTrafarets(userId: number) {
    return this.prisma.campaignItem.findMany({
      where: {
        userId,
        type: "SKU"
      },
      select: {
        campaignId: true,
        searchQuery: true,
        sku: true,
        title: true,
        price: true,
        views: true,
        clicks: true,
        ctr: true,
        toCart: true,
        avgBid: true,
        moneySpent: true,
        orders: true,
        ordersMoney: true,
        models: true,
        modelsMoney: true,
        drr: true,
        createdAt: true,
        type: true,
      }
    })
  }
  async getDataForExportSearch(userId: number) {
    return this.prisma.campaignItem.findMany({
      where: {
        userId,
        type: "SEARCH_PROMO"
      },
      select: {
        campaignId: true,
        searchQuery: true,
        sku: true,
        title: true,
        price: true,
        views: true,
        clicks: true,
        ctr: true,
        toCart: true,
        avgBid: true,
        moneySpent: true,
        orders: true,
        ordersMoney: true,
        models: true,
        modelsMoney: true,
        drr: true,
        createdAt: true,
        type: true,
      }
    })
  }
  async getDataForExportBanner(userId: number) {
    return this.prisma.campaignItem.findMany({
      where: {
        userId,
        type: "BANNER"
      },
      select: {
        campaignId: true,
        searchQuery: true,
        sku: true,
        title: true,
        price: true,
        views: true,
        clicks: true,
        ctr: true,
        toCart: true,
        avgBid: true,
        moneySpent: true,
        orders: true,
        ordersMoney: true,
        models: true,
        modelsMoney: true,
        drr: true,
        createdAt: true,
        type: true,
      }
    })
  }
}