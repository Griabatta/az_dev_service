import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JournalErrorsModule } from 'src/Errors/errors.module';
import { GoogleSheetsModule } from 'src/exporter/exports.module';
import { PerformanceModule } from 'src/Modules/ozon/performance/performance.module';
import { PrismaModule } from 'src/Prisma/prisma.module';
import { SellerModule } from 'src/Modules/ozon/Seller/seller.module';
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