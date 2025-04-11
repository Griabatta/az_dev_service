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

@Module({
  imports: [
    // 1. Независимые модули
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    JournalErrorsModule,

    // 2. Модули с базовыми зависимостями
    UserModule,
    TokenModule,
    
    // 3. Модули, зависящие от User/Token
    PerformanceScheduleModule,
    PerformanceModule,
    SellerModule,
    TaskModule,
    
    // 4. Остальные
    MPStatModule,
    GoogleSheetsModule,
    PerformanceScheduleModule
  ]
})
export class AppModule {}