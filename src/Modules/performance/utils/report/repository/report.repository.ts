import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { CampaignItemDTO, CampaignItemInput, CreateReportDTO, ParsedCampaignItem } from "../models/report.dto";
import { isValid, lightFormat, startOfDay } from "date-fns";


@Injectable()
export class ReportRepo {
    private readonly logger = new Logger(ReportRepo.name)
    constructor(
      private readonly prisma: PrismaService
    ) {};

    async getAllReports() {
      return this.prisma.reports.findMany();
    };

    async createReport(data: CreateReportDTO): Promise<CreateReportDTO> {
      return this.prisma.reports.create({
        data
      })
    }

    async updateReport(id: number, status: string) {
      return this.prisma.reports.update({
        where: {id},
        data: {
          status: status
        }
      })
    }

    async getReportByUserId(userId: number) {
      return this.prisma.reports.findMany({
        where: { userId }
      })
    }

    async createCampaignItem(data) {
      const ret = this.prisma.campaignItem.createMany({
        data: data,
        skipDuplicates: true
      });
      return ret
    }

    async bulkUpsertCampaignItems(data: CampaignItemInput[], userId: number) {
      // 1. Получаем существующие записи одним запросом
      const existingItems = await this.prisma.campaignItem.findMany({
        where: {
          userId,
          createdAtDB: {
            in: data.map(item => startOfDay(item.createdAtDB ? new Date(item.createdAtDB) : new Date()))
          },
          campaignId: {
            in: data.map(item => item.campaignId)
          }
        },
        select: {
          userId: true,
          createdAtDB: true,
          campaignId: true,
          id: true
        }
      });
    
      // 2. Создаем Map для быстрого поиска
      const existingMap = new Map(
        existingItems.map(item => [
          `${item.userId}_${item.createdAtDB.toISOString()}_${item.campaignId}`,
          item.id
        ])
      );
    
      // 3. Разделяем данные на создание и обновление
      const toCreate: CampaignItemInput[] = [];
      const toUpdate: { id: number; data: Partial<CampaignItemInput> }[] = [];
    
      data.forEach(item => {
        const date = startOfDay(item.createdAtDB ? new Date(item.createdAtDB) : new Date());
        const uniqueKey = `${userId}_${date.toISOString()}_${item.campaignId}`;
    
        if (existingMap.has(uniqueKey)) {
          // 4. Фильтруем только измененные поля
          const existingId = existingMap.get(uniqueKey);
          const updateData = this.getChangedFields(item, existingItems.find(x => x.id === existingId));
          
          if (Object.keys(updateData).length > 0) {
            toUpdate.push({ id: Number(existingId), data: updateData });
          }
        } else {
          toCreate.push({
            ...item,
            userId,
            createdAtDB: date
          });
        }
      });
    
      // 5. Выполняем операции батчами
      const BATCH_SIZE = 500;
    
      // Создаем новые записи
      for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
        await this.prisma.campaignItem.createMany({
          data: toCreate.slice(i, i + BATCH_SIZE),
          skipDuplicates: true
        });
      }
    
      // Обновляем существующие
      for (const { id, data } of toUpdate) {
        await this.prisma.campaignItem.update({
          where: { id },
          data
        });
      }
    }

    
    private getChangedFields(newItem: CampaignItemInput, existingItem): Partial<CampaignItemInput> {
      const changes: Partial<CampaignItemInput> = {};
      const comparableFields = ['views', 'clicks', 'toCart', 'orders', 'models', 'ctr', 'avgBid', 'moneySpent', 'ordersMoney', 'searchQuery', 'sku', 'price', 'modelsMoney', 'drr']
    
      comparableFields.forEach(field => {
        if (newItem[field] !== existingItem[field]) {
          changes[field] = newItem[field];
        }
      });
    
      return changes;
    }

    // async upsertCampaignItems(items: ParsedCampaignItem[]) {
    //     return Promise.all(
    //       items.map(item =>
    //         this.prisma.campaignItem.upsert({
    //           where: {
    //             campaign_user_date_camp: {
    //               campaignId: item.campaignId,
    //               userId: item.userId,
    //               createdAt: item.createdAt
    //             }
    //           },
    //           update: item,
    //           create: item
    //         })
    //       )
    //     );
    //   }
}