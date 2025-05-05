import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './Modules/ozon/Seller/seller.module';
import { GoogleSheetsModule } from './exporter/exports.module';
import { UserModule } from './Modules/Auth/user.module';
import { MPStatModule } from './Modules/mpstat/mpstat.module';
import { PerformanceModule } from './Modules/ozon/performance/performance.module';
import { PerformanceScheduleModule } from './Modules/ozon/performance/shedule/performance_shedule.module';
import { TaskModule } from './Tasks/tasks.module';
import { PrismaModule } from './Prisma/prisma.module';
import { JournalErrorsModule } from './Errors/errors.module';
import { TokenModule } from './Modules/ozon/performance/utils/token/token.module';
import { SheduleCronModule } from './scheduler/shedule.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    // // 1. Независимые базовые модули
    // ConfigModule.forRoot(),
    // HttpModule,
    // // ScheduleModule.forRoot(),
    // PrismaModule,
    // JournalErrorsModule,
    // TelegramModule,

    // // // 2. Основные функциональные модули
    // UserModule,
    // TokenModule,
    
    // // 3. Модули, зависящие от базовых
    // GoogleSheetsModule,
    // SellerModule,
    // TaskModule,
    // PerformanceModule,
    
    // // 4. Специальные модули
    // SheduleCronModule,
    // PerformanceScheduleModule,
    // MPStatModule
  ]
})
export class AppModule {}