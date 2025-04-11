
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { generalForSeller } from './general';

@Injectable()
export class AnalyticsRepository {
  private readonly logger = new Logger(AnalyticsRepository.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly general: generalForSeller
  ) {}

  async create(data: Prisma.AnalyticsCreateInput) {
    return this.prisma.analytics.create({
      data,
    });
  }

  // async upsertManyAnalytics(data: any[], userId: number) {
  //   const chunkSize = 20;
  //   const chunks = Array.from(
  //     { length: Math.ceil(data.length / chunkSize) },
  //     (_, i) => data.slice(i * chunkSize, (i + 1) * chunkSize)
  //   );
  
  //   for (const chunk of chunks) {
  //     try {
  //       await this.prisma.$transaction(
  //         chunk.map(item => {
  //           const rawDate = item.date ? new Date(item.date) : new Date();
  //           if (!isValid(rawDate)) throw new Error(`Invalid date: ${item.date}`);
  
  //           const dateAtStartOfDay = startOfDay(rawDate);
  //           const { userId, createdAt, dimensionsId, ...updateData } = item;
  
  //           return this.prisma.analytics.upsert({
  //             where: {
  //               analytics_user_dimensions_date: {
  //                 userId,
  //                 dimensionsId: item.dimensionsId,
  //                 createAt: dateAtStartOfDay
  //               }
  //             },
  //             create: { userId, ...item, createAt: dateAtStartOfDay },
  //             update: updateData
  //           });
  //         })
  //       );
  //     } catch (error) {
  //       this.logger.error(`Chunk failed: ${error.message}`);
  //       throw error;
  //     }
  //   }
  // }
  async upsertManyAnalytics(data: any, userId: number) {
    const existing = await this.prisma.analytics.findMany({
      where: {
        userId,
        createAt: {
          in: data.map(d => startOfDay(d.dimensionsDate ? new Date(d.dimensionsDate) : new Date()))
        },
        dimensionsId: {
          in: data.map(d => d.dimensionsId).filter(Number)
        }
      },
      select: { userId: true, dimensionsId: true, createAt: true, id: true }
    });
  
    const existingMap = new Map(
      existing.map(item => [
        `${item.userId}_${item.dimensionsId}_${item.createAt.toISOString()}`,
        item.id
      ])
    );
  
    const { toCreate, toUpdate } = data.reduce((acc, item) => {
      const date = startOfDay(item.dimensionsDate ? new Date(item.dimensionsDate) : new Date());
      const key = `${userId}_${item.dimensionsId}_${date.toISOString()}`;
      
      if (existingMap.has(key)) {
        acc.toUpdate.push({
          id: existingMap.get(key)!,
          data: this.general.getChangedFields(item, existing.find(e => e.id === existingMap.get(key))!)
        });
      } else {
        acc.toCreate.push({ ...item, userId, createAt: date });
      }
      return acc;
    }, { toCreate: [], toUpdate: [] });
  
    // Batch create
    if (toCreate.length) {
      await this.prisma.analytics.createMany({
        data: toCreate,
        skipDuplicates: true
      });
    }
  
    // Batch update
    for (const { id, data } of toUpdate) {
      await this.prisma.analytics.update({
        where: { id },
        data
      });
    }
  }

  async createMany(data: Prisma.AnalyticsCreateManyInput[]) {
    return this.prisma.analytics.createMany({
        data,
        skipDuplicates: true
    })
  }

  // Получение аналитики по ID
  async findById(id: number) {
    return this.prisma.analytics.findUnique({
      where: { id },
      include: { user: true }, // Если нужно загрузить связанного пользователя
    });
  }

  // Получение аналитики по ID пользователя
  async findByUserId(userId: number) {
    return this.prisma.analytics.findMany({
      where: { userId },
      select: {
        id: true,
        createAt: true,
        dimensionsDate: true,
        dimensionsId: true,
        dimensionsName: true,
        revenue: true,
        ordered_units: true,
        hits_view_search: true,
        hits_view_pdp: true,
        hits_view: true,
        hits_tocart_search: true,
        hits_tocart_pdp: true,
        hits_tocart: true,
        session_view_search: true,
        session_view_pdp: true,
        session_view: true,
        conv_tocart_search: true,
        conv_tocart_pdp: true,
        conv_tocart: true,
        returns: true,
        cancellations: true,
        delivered_units: true,
        position_category: true,
      }
    });
  }

  // Обновление аналитики
  async update(id: number, data: Prisma.AnalyticsUpdateInput) {
    return this.prisma.analytics.update({
      where: { id },
      data,
    });
  }

  // Удаление аналитики
  async delete(id: number) {
    return this.prisma.analytics.delete({
      where: { id },
    });
  }

  // Пагинация и фильтрация
  async findWithPagination(
    userId: number,
    skip: number,
    take: number,
    filters?: { fromDate?: Date; toDate?: Date },
  ) {
    return this.prisma.analytics.findMany({
      where: {
        userId,
        createAt: {
          gte: filters?.fromDate,
          lte: filters?.toDate,
        },
      },
      skip,
      take,
      orderBy: { createAt: 'desc' },
    });
  }
}