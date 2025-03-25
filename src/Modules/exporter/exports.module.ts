import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsController } from 'src/Modules/exporter/exports.controller';
import { GoogleSheetsService } from 'src/Modules/exporter/exports.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { AnalyticsRepository } from '../Seller/repositories/analytics.repository';
import { StockRepository } from '../Seller/repositories/stock-warehouse.repository';
import { TransactionRepository } from '../Seller/repositories/transaction.repository';
import { ProductRepository } from '../Seller/repositories/productList.repository';
import { JournalErrorsService } from '../Errors/errors.service';
import { JournalErrorsRepository } from '../Errors/repositories/error.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    GoogleSheetsService,
    PrismaService,
    AnalyticsRepository,
    StockRepository,
    TransactionRepository,
    ProductRepository,
    JournalErrorsService,
    JournalErrorsRepository
  ],
  controllers: [GoogleSheetsController],
  exports: [GoogleSheetsService, PrismaService],
})
export class GoogleSheetsModule {}