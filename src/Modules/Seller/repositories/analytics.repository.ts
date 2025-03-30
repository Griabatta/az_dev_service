
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(
    private readonly prisma: PrismaService) {}

  async create(data: Prisma.AnalyticsCreateInput) {
    return this.prisma.analytics.create({
      data,
    });
  }

  async createMany(data: Prisma.AnalyticsCreateManyInput[]) {
    return this.prisma.analytics.createMany({
        data
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