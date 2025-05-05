import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsController } from 'src/exporter/exports.controller';
import { GoogleSheetsService } from 'src/exporter/exports.service';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PerformanceModule } from '../Modules/ozon/performance/performance.module';
import { SellerModule } from '../Modules/ozon/Seller/seller.module';
import { UserModule } from '../Modules/Auth/user.module';
import { JournalErrorsModule } from '../Errors/errors.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => PerformanceModule), 
    forwardRef(() => SellerModule),
    forwardRef(() => UserModule),
    JournalErrorsModule
  ],
  providers: [
    GoogleSheetsService,
    PrismaService,
  ],
  controllers: [GoogleSheetsController],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}