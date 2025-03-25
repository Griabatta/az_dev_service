import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Stock_WarehouseCreateInput) {
    return this.prisma.stock_Warehouse.create({ data });
  }

  async createMany(data: Prisma.Stock_WarehouseCreateManyInput[]) {
    return this.prisma.stock_Warehouse.createMany({ data });
  }

  async findById(id: number) {
    return this.prisma.stock_Warehouse.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.stock_Warehouse.findMany({ where: { userId } });
  }

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