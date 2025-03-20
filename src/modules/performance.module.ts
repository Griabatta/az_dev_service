
import { Module } from '@nestjs/common';
import { PerformanceController } from 'src/controllers/ozon-performance.controller';
import { OzonPerformanceService } from 'src/logic/ozon_performance.service';
import { PrismaService } from 'src/logic/prisma.service';
@Module({
  controllers: [PerformanceController],
  providers: [OzonPerformanceService, PrismaService],
})
export class PerformanceModule {}