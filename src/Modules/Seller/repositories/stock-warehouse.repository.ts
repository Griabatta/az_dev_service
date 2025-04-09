import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Stock_WarehouseCreateInput) {
    return this.prisma.stock_Warehouse.create({ data });
  }

  async createMany(data: Prisma.Stock_WarehouseCreateManyInput[]) {
    return this.prisma.stock_Warehouse.createMany({ 
      data,
      skipDuplicates: true
    });
  };

  async upsertManyStock(data: any[], userId: number) {
    return await this.prisma.$transaction(
      data.map(item => {
        
        const rawDate = item.date ? new Date(item.date) : new Date();
        
        if (!isValid(rawDate)) {
          throw new Error(`Invalid date format: ${item.date}`);
        }
        
        const dateAtStartOfDay = startOfDay(rawDate);

        return this.prisma.stock_Warehouse.upsert({
          where: {
            stock_user_sku_stock_date: {
              userId,
              sku: item.sku,
              warehouse_name: item.warehouse_name,
              createAt: dateAtStartOfDay
            }
          },
          create: {
            userId,
            createAt: dateAtStartOfDay,
            sku: item.sku,	               
            warehouse_name: item.warehouse_name,
            item_code: item.item_code,
            item_name: item.item_name,
            free_to_sell_amount: item.free_to_sell_amount,
            promised_amount: item.promised_amount,
            reserved_amount: item.reserved_amount,
            idc: item.idc
          },
          update: {
            warehouse_name: item.warehouse_name,
            createAt: item.createAt,
            sku: item.sku,
            ...item
          }
        });
      })
    );
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