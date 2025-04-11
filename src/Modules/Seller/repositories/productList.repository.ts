import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { generalForSeller } from './general';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly general: generalForSeller
  ) {}

  async create(data: Prisma.Product_ListCreateInput) {
    return this.prisma.product_List.create({ data });
  }

  async createMany(data: Prisma.Product_ListCreateManyInput[]) {
    return this.prisma.product_List.createMany({
      data,
      skipDuplicates: true
    });
  };

  // async upsertManyProduct(data: any[], userId: number) {
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
  //           const { userId, createdAt, offer_id, ...updateData } = item;
  
  //           return this.prisma.product_List.upsert({
  //             where: {
  //               product_user_offer_date: {
  //                 userId,
  //                 offer_id: item.offer_id,
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

  async upsertManyProduct(data: any[], userId: number) {
    const existingMap = await this.getExistingProductsMap(data, userId);
    
    const { toCreate, toUpdate } = data.reduce((acc, item) => {
      const date = startOfDay(item.createAt ? new Date(item.createAt) : new Date());
      const key = `${userId}_${item.offer_id}_${date.toISOString()}`;
      
      if (existingMap.has(key)) {
        acc.toUpdate.push({
          id: existingMap.get(key)!,
          data: this.general.getChangedFields(item, existingMap.get(key)!)
        });
      } else {
        acc.toCreate.push({ ...item, userId, createAt: date });
      }
      return acc;
    }, { toCreate: [], toUpdate: [] });
  
    // Parallel execution
    await Promise.all([
      this.prisma.product_List.createMany({
        data: toCreate,
        skipDuplicates: true
      }),
      ...toUpdate.map(({ id, data }) => 
        this.prisma.product_List.update({ where: { id }, data })
      )
    ]);
  }
  
  private async getExistingProductsMap(data: any[], userId: number) {
    const existing = await this.prisma.product_List.findMany({
      where: {
        userId,
        createAt: {
          in: data.map(d => startOfDay(d.date ? new Date(d.date) : new Date()))
        },
        offer_id: { in: data.map(d => d.offer_id) }
      }
    });
  
    return new Map(
      existing.map(item => [
        `${item.userId}_${item.offer_id}_${item.createAt.toISOString()}`,
        item
      ])
    );
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