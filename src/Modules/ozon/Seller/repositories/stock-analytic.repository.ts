import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { PrismaService } from 'src/Prisma/prisma.service';
import { generalForSeller } from './general';
import { CreateStockAnalyticsDto } from '../models/create-seller.dto';

@Injectable()
export class StockAnalyticRepository {
  private readonly logger = new Logger(StockAnalyticRepository.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly general: generalForSeller
  ) {}

  async create(data: Prisma.Stock_AnalyticCreateInput) {
    return this.prisma.stock_Analytic.create({ data });
  }

  async createMany(data: CreateStockAnalyticsDto[]) {
    this.logger.log(data)
    try {
      return this.prisma.stock_Analytic.createMany({ 
        data,
        // skipDuplicates: true
      });
    } catch (e) {
      this.logger.error(e.text || e.message || e.code || e.status) 
    }
  };


  async upsertManyStock(data: any[], userId: number) {
    const existing = await this.prisma.stock_Analytic.findMany({
      where: {
        userId,
        request_date: {
          in: data.map(d => d.request_date)
        }
      },
      select: { userId: true, request_date: true, id: true }
    });
  
    const { toCreate, toUpdate } = data.reduce((acc, item) => {
      const date = format(new Date(), 'yyyy-MM-dd');
      const existingItem = existing.find(e => 
        e.userId === userId &&
        e.request_date === date &&
        e.id === item.id
      );
  
      if (existingItem) {
        acc.toUpdate.push({
          id: existingItem.id,
          data: this.general.getChangedFields(item, existingItem)
        });
      } else {
        acc.toCreate.push({ ...item, userId});
      }
      return acc;
    }, { toCreate: [], toUpdate: [] });
  
    const BATCH_SIZE = 100;
    for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
      await this.prisma.stock_Analytic.createMany({
        data: toCreate.slice(i, i + BATCH_SIZE),
        skipDuplicates: true
      });
    }
  
    for (const { id, data } of toUpdate) {
      await this.prisma.stock_Analytic.update({
        where: { id },
        data
      });
    }
  }

  async findById(id: number) {
    return this.prisma.stock_Analytic.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.stock_Analytic.findMany({ 
      where: { userId },
      select: {
        id: true,
        request_date: true,
      }
    });
  };


  async update(id: number, data: Prisma.Stock_AnalyticUpdateInput) {
    return this.prisma.stock_Analytic.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.stock_Analytic.delete({ where: { id } });
  }

}