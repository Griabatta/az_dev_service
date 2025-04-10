import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JournalErrorsModule } from 'src/Modules/Errors/errors.module';
import { GoogleSheetsModule } from 'src/Modules/exporter/exports.module';
import { PerformanceModule } from 'src/Modules/performance/performance.module';
import { PrismaModule } from 'src/Modules/Prisma/prisma.module';
import { SellerModule } from 'src/Modules/Seller/seller.module';

@Module({
  imports: 
  [
    ScheduleModule.forRoot(),
    PerformanceModule,
    SellerModule,
    JournalErrorsModule,
    GoogleSheetsModule,
    PrismaModule,
  ],
})
export class AppModule {}