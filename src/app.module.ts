import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './Modules/Seller/seller.module';
import { GoogleSheetsModule } from './Modules/exporter/exports.module';
import { UserModule } from './Modules/Auth/user.module';
import { PerformanceModule } from './Modules/performance/performance.module';
import { MPStatModule } from './Modules/mpstat/mpstat.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    SellerModule,
    PerformanceModule,
    MPStatModule,
    GoogleSheetsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}