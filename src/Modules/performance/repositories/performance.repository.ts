// performance/repositories/performance.repository.ts
import { Injectable } from '@nestjs/common';
import { CampaignTemplateDto } from '../models/performance.dto';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { CampaignDto } from '../models/campaint.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PerformanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Токены
  

  async createCampaing(data: Prisma.CampaignTemplateCreateManyInput[]) {
    return this.prisma.campaignTemplate.createMany({
      data
    });
  }

  // async upsertCampaign(userId: number, data: CampaignDto) {
  //   return this.prisma.campaignTemplate.upsert({
  //     where: { userId: userId },
  //     create: {
  //       // campaignId: data.id, // Removed as it is not a valid property
  //       title: data.title,
  //       state: data.state,
  //       advObjectType: data.advObjectType,
  //       fromDate: new Date(data.fromDate),
  //       toDate: data.toDate ? new Date(data.toDate) : null,
  //       dailyBudget: data.dailyBudget.toString(),
  //       budget: data.budget.toString(),
  //       productCampaignMode: data.productCampaignMode,
  //       productAutopilotStrategy: data.productAutopilotStrategy,
  //       paymentType: data.paymentType,
  //       expenseStrategy: data.expenseStrategy,
  //       weeklyBudget: data.weeklyBudget.toString(),
  //       budgetType: data.budgetType,
  //       startWeekDay: data.startWeekDay,
  //       endWeekDay: data.endWeekDay,
  //       maxBid: data.maxBid?.toString(),
  //       categoryId: data.categoryId?.toString(),
  //       skuAddMode: data.skuAddMode,
  //       filters: data.filter.toString(),
  //       placement: data.placement, // Сохраняем как JSON строку
  //       userId,
  //       createdAt: new Date(), // Add default createdAt
  //       updatedAt: new Date(), // Add default updatedAt
  //     },
  //     update: {
  //       title: data.title,
  //       state: data.state,
  //       // ... все обновляемые поля
  //       placement: data.placement,
  //       maxBid: data.maxBid?.toString(),
  //       categoryId: data.categoryId?.toString(),
  //       skuAddMode: data.skuAddMode,
  //       filters: data.filter.toString(),
  //     },
  //   });
  // }

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