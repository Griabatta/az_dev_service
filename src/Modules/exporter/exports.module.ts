import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsController } from 'src/Modules/exporter/exports.controller';
import { GoogleSheetsService } from 'src/Modules/exporter/exports.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { PerformanceModule } from '../performance/performance.module';
import { SellerModule } from '../Seller/seller.module';
import { UserModule } from '../Auth/user.module';
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