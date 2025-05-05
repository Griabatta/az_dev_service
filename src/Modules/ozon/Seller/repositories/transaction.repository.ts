import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class TransactionRepository {

  private readonly logger = new Logger(TransactionRepository.name)
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Transaction_ListCreateInput) {
    return this.prisma.transaction_List.create({ data });
  }

  async createMany(data: Prisma.Transaction_ListCreateManyInput[]) {
    return this.prisma.transaction_List.createMany({
      data,
      skipDuplicates: true
    });
  };

  // async upsertManyTransaction(data: any[], userId: number) {
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
  //           const { userId, createdAt, operation_id, ...updateData } = item;
  
  //           return this.prisma.transaction_List.upsert({
  //             where: {
  //               transaction_user_date_operId: {
  //                 userId,
  //                 operation_id: operation_id,
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

  async upsertManyTransaction(data: any[], userId: number) {
    const operations = data.map(item => {
      const date = startOfDay(item.createAt ? new Date(item.createAt) : new Date());
      return this.prisma.transaction_List.upsert({
        where: {
          transaction_user_date_operId: {
            userId,
            operation_id: item.operation_id,
            createAt: date
          }
        },
        create: { ...item, userId, createAt: date },
        update: this.excludeKeys(item, ['userId', 'operation_id', 'createAt'])
      });
    });
  
    // Execute in chunks
    const CHUNK_SIZE = 50;
    for (let i = 0; i < operations.length; i += CHUNK_SIZE) {
      await this.prisma.$transaction(operations.slice(i, i + CHUNK_SIZE));
    }
  }
  
  private excludeKeys<T>(obj: T, keys: (keyof any)[]): Omit<T, typeof keys[number]> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  }

  async findById(id: number) {
    return this.prisma.transaction_List.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.transaction_List.findMany({ 
      where: { userId },
      select: {
        id: true,
        createAt: true,
        operation_id: true,
        operation_type: true,
        operation_date: true,
        operation_type_name: true,
        delivery_charge: true,
        return_delivery_charge: true,
        accruals_for_sale: true,
        sale_commission: true,
        amount: true,
        type: true,
        delivery_schema: true,
        order_date: true,
        posting_number: true,
        warehouse_id: true,
        items: true,
        services: true
      }
    });
  }

  async findByOperationId(operationId: string) {
    return this.prisma.transaction_List.findFirst({
      where: { operation_id: operationId },
    });
  }

  async update(id: number, data: Prisma.Transaction_ListUpdateInput) {
    return this.prisma.transaction_List.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.transaction_List.delete({ where: { id } });
  }

  async findWithPagination(
    userId: number,
    skip: number,
    take: number,
    filters?: { operationType?: string; fromDate?: Date; toDate?: Date },
  ) {
    return this.prisma.transaction_List.findMany({
      where: {
        userId,
        operation_type: filters?.operationType,
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