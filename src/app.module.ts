import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { SellerModule } from './modules/seller.module';
import { PerformanceModule } from './modules/performance.module';
import { MPStatModule } from './modules/mpstat.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    SellerModule,
    PerformanceModule,
    MPStatModule
  ]
})
export class AppModule {}