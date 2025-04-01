import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Product_ListCreateInput) {
    return this.prisma.product_List.create({ data });
  }

  async createMany(data: Prisma.Product_ListCreateManyInput[]) {
    return this.prisma.product_List.createMany({ data });
  }

  async findById(id: number) {
    return this.prisma.product_List.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    if (!userId) {
      return 0;
    }
    return this.prisma.product_List.findMany({ 
      where: { userId },
      select: {
        id: true,
        createAt: true,
        archived: true,
        has_fbo_stocks: true,
        has_fbs_stocks: true,
        is_discounted: true,
        offer_id: true,
        product_id: true,
        quants: true
      }
    });
  }

  async findByOfferId(offerId: string) {
    return this.prisma.product_List.findFirst({
      where: { offer_id: offerId },
    });
  }

  async update(id: number, data: Prisma.Product_ListUpdateInput) {
    return this.prisma.product_List.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.product_List.delete({ where: { id } });
  }

  async findWithPagination(
    userId: number,
    skip: number,
    take: number,
    filters?: { 
      archived?: boolean; 
      offerId?: string; 
      hasFbsStocks?: boolean 
    },
  ) {
    return this.prisma.product_List.findMany({
      where: {
        userId,
        archived: filters?.archived,
        offer_id: filters?.offerId,
        has_fbs_stocks: filters?.hasFbsStocks,
      },
      skip,
      take,
      orderBy: { createAt: 'desc' },
    });
  }
}