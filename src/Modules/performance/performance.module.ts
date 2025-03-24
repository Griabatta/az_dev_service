
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { PerformanceController } from './ozon-performance.controller';
import { OzonPerformanceService } from './ozon_performance.service';
@Module({
  controllers: [PerformanceController],
  providers: [OzonPerformanceService, PrismaService],
})
export class PerformanceModule {}