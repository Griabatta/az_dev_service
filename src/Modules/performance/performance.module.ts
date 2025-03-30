import { Module } from '@nestjs/common';
import { PerformanceController } from './ozon-performance.controller';
import { OzonPerformanceService } from './ozon_performance.service';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { PerformanceCampaingsRep } from './repositories/campaings.repostiroty';
import { JournalErrorsModule } from '../Errors/errors.module';
import { PerformanceRepository } from './repositories/performance.repository';
import { DuplicateChecker } from 'src/utils/duplicateChecker';
import { ReportModule } from 'src/Report/report.module';

@Module({
  imports: [
    JournalErrorsModule,
    HttpModule,
    ReportModule
  ],
  controllers: [PerformanceController],
  providers: [
    OzonPerformanceService,
    PrismaService,
    PerformanceCampaingsRep,
    PerformanceRepository,
    DuplicateChecker
  ],
  exports: [OzonPerformanceService, PerformanceRepository]
})
export class PerformanceModule {}