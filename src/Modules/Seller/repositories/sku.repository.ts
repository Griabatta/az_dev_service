import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { formatISO, isValid, startOfDay } from 'date-fns';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { generalForSeller } from './general';

@Injectable()
export class SKUListRepository {

  private readonly logger = new Logger(SKUListRepository.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly general: generalForSeller
  ) {}

  async create(data: Prisma.SKU_ListCreateInput) {
    return this.prisma.sKU_List.create({ data });
  }

  async createMany(data: Prisma.SKU_ListCreateManyInput[]) {
    return this.prisma.sKU_List.createMany({ 
      data,
      skipDuplicates: true
    });
  };

  async getByUserId(userId: number) {
    return this.prisma.sKU_List.findMany({
        where: {
            userId
        },
        select: {
            SKU: true
        }
    })
  }
}