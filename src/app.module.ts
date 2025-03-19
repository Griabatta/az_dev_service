import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { PerformanceController } from './controllers/ozon-performance.controller';
import { SellerController } from './controllers/ozon-seller.controller';
import { OzonPerformanceService } from './logic/ozon_performance.service';
import { OzonSellerService } from './logic/ozon_seller.service';
import { OzonMpstatsService } from './logic/ozon_mpstats.service';
import { MpstatsController } from './controllers/mpstat.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './logic/prisma.service';
import { UserController } from './controllers/auth.controller';
import { UserService } from './logic/auth.service';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule
  ],
  controllers: [PerformanceController, SellerController, MpstatsController, UserController],
  providers: [OzonSellerService, OzonPerformanceService, OzonMpstatsService, PrismaService, UserService],
  exports: [PrismaService]
})
export class AppModule {}