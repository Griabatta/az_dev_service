import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class JournalErrorsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.JournalErrorsCreateInput) {
    return this.prisma.journalErrors.create({ data });
  }

  async createMany(data: Prisma.JournalErrorsCreateManyInput[]) {
    return this.prisma.journalErrors.createMany({ data });
  }

  async findById(id: number) {
    return this.prisma.journalErrors.findUnique({ where: { id } });
  }

  async findByUserId(errorUserId: number) {
    return this.prisma.journalErrors.findMany({ 
      where: { errorUserId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByService(errorServiceName: string) {
    return this.prisma.journalErrors.findMany({
      where: { errorServiceName },
      orderBy: { errorPriority: 'desc' },
    });
  }

  async update(id: number, data: Prisma.JournalErrorsUpdateInput) {
    return this.prisma.journalErrors.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.journalErrors.delete({ where: { id } });
  }

  async findWithFilters(filters: {
    userId?: number;
    priority?: number;
    serviceName?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    return this.prisma.journalErrors.findMany({
      where: {
        errorUserId: filters.userId,
        errorPriority: filters.priority,
        errorServiceName: filters.serviceName,
        createdAt: {
          gte: filters.fromDate,
          lte: filters.toDate,
        },
      },
      orderBy: [{ errorPriority: 'desc' }, { createdAt: 'desc' }],
    });
  }
}