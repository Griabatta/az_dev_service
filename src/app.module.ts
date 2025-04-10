import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './Modules/Seller/seller.module';
import { GoogleSheetsModule } from './Modules/exporter/exports.module';
import { UserModule } from './Modules/Auth/user.module';
import { MPStatModule } from './Modules/mpstat/mpstat.module';
import { PerformanceModule } from './Modules/performance/performance.module';
import { PerformanceScheduleModule } from './Modules/performance/shedule/performance_shedule.module';
import { TaskModule } from './Modules/Tasks/tasks.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    SellerModule,
    PerformanceModule,
    MPStatModule,
    GoogleSheetsModule,
    PerformanceScheduleModule,
    TaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}