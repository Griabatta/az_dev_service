import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.Transaction_ListCreateInput) {
    return this.prisma.transaction_List.create({ data });
  }

  async createMany(data: Prisma.Transaction_ListCreateManyInput[]) {
    return this.prisma.transaction_List.createMany({ data });
  }

  async findById(id: number) {
    return this.prisma.transaction_List.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.transaction_List.findMany({ where: { userId } });
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