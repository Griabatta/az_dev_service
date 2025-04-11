import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { generalForSeller } from './general';

@Injectable()
export class StockRepository {

  private readonly logger = new Logger(StockRepository.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly general: generalForSeller
  ) {}

  async create(data: Prisma.Stock_WarehouseCreateInput) {
    return this.prisma.stock_Warehouse.create({ data });
  }

  async createMany(data: Prisma.Stock_WarehouseCreateManyInput[]) {
    return this.prisma.stock_Warehouse.createMany({ 
      data,
      skipDuplicates: true
    });
  };

  // async upsertManyStock(data: any[], userId: number) {
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
  //           const { userId, createdAt, sku, warehouse_name, ...updateData } = item;
  
  //           return this.prisma.stock_Warehouse.upsert({
  //             where: {
  //               stock_user_sku_stock_date: {
  //                 userId,
  //                 sku: sku,
  //                 createAt: dateAtStartOfDay,
  //                 warehouse_name: warehouse_name
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

  async upsertManyStock(data: any[], userId: number) {
    const existing = await this.prisma.stock_Warehouse.findMany({
      where: {
        userId,
        createAt: {
          in: data.map(d => startOfDay(d.createAt ? new Date(d.createAt) : new Date()))
        },
        sku: { in: data.map(d => d.sku) }
      },
      select: { userId: true, sku: true, warehouse_name: true, createAt: true, id: true }
    });
  
    const { toCreate, toUpdate } = data.reduce((acc, item) => {
      const date = startOfDay(item.createAt ? new Date(item.createAt) : new Date());
      const existingItem = existing.find(e => 
        e.userId === userId && 
        e.sku === item.sku &&
        e.warehouse_name === item.warehouse_name &&
        e.createAt.getTime() === date.getTime()
      );
  
      if (existingItem) {
        acc.toUpdate.push({
          id: existingItem.id,
          data: this.general.getChangedFields(item, existingItem)
        });
      } else {
        acc.toCreate.push({ ...item, userId, createAt: date });
      }
      return acc;
    }, { toCreate: [], toUpdate: [] });
  
    // Execute in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
      await this.prisma.stock_Warehouse.createMany({
        data: toCreate.slice(i, i + BATCH_SIZE),
        skipDuplicates: true
      });
    }
  
    for (const { id, data } of toUpdate) {
      await this.prisma.stock_Warehouse.update({
        where: { id },
        data
      });
    }
  }

  async findById(id: number) {
    return this.prisma.stock_Warehouse.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.stock_Warehouse.findMany({ 
      where: { userId },
      select: {
        id: true,
        createAt: true,
        sku: true,
        warehouse_name: true,
        item_code: true,
        item_name: true,
        free_to_sell_amount: true,
        promised_amount: true,
        reserved_amount: true,
        idc: true
      }
    });
  };

  async findBySku(userId: number, sku: number) {
    return this.prisma.stock_Warehouse.findMany({
      where: { userId, sku },
    });
  }

  async update(id: number, data: Prisma.Stock_WarehouseUpdateInput) {
    return this.prisma.stock_Warehouse.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.stock_Warehouse.delete({ where: { id } });
  }

  async findWithPagination(
    userId: number,
    skip: number,
    take: number,
    filters?: { warehouseName?: string; sku?: number },
  ) {
    return this.prisma.stock_Warehouse.findMany({
      where: {
        userId,
        warehouse_name: filters?.warehouseName,
        sku: filters?.sku,
      },
      skip,
      take,
      orderBy: { createAt: 'desc' },
    });
  }
}