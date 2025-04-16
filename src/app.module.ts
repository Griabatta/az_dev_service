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
import { PrismaModule } from './Modules/Prisma/prisma.module';
import { JournalErrorsModule } from './Modules/Errors/errors.module';
import { TokenModule } from './Modules/performance/utils/token/token.module';
import { SheduleCronModule } from './scheduler/shedule.module';

@Module({
  imports: [
    // 1. Независимые базовые модули
    ConfigModule.forRoot(),
    HttpModule,
    ScheduleModule.forRoot(),
    PrismaModule,
    JournalErrorsModule,

    // 2. Основные функциональные модули
    UserModule,
    TokenModule,
    
    // 3. Модули, зависящие от базовых
    GoogleSheetsModule,
    SellerModule,
    TaskModule,
    PerformanceModule,
    
    // 4. Специальные модули
    SheduleCronModule,
    PerformanceScheduleModule,
    MPStatModule
  ]
})
export class AppModule {}