import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JournalErrorsModule } from 'src/Modules/Errors/errors.module';
import { GoogleSheetsModule } from 'src/Modules/exporter/exports.module';
import { PerformanceModule } from 'src/Modules/performance/performance.module';
import { PrismaModule } from 'src/Modules/Prisma/prisma.module';
import { SellerModule } from 'src/Modules/Seller/seller.module';
import { OzonScheduler } from './ozon.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => PerformanceModule),
    forwardRef(() => SellerModule),
    JournalErrorsModule,
    forwardRef(() => GoogleSheetsModule),
    PrismaModule,
  ],
  providers: [OzonScheduler],
  exports: [OzonScheduler]
})
export class SheduleCronModule {}