// src/modules/analytics/repositories/analytics.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Создание записи аналитики
  async create(data: Prisma.AnalyticsCreateInput) {
    return this.prisma.analytics.create({
      data,
    });
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

  // Получение агрегированных данных (например, сумма revenue по пользователю)
  async getAggregatedData(userId: number) {
    return this.prisma.analytics.aggregate({
      where: { userId },
      _sum: {
        revenue: true,
        ordered_units: true,
        // другие метрики...
      },
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