import { Module } from '@nestjs/common';
import { SellerController } from 'src/Modules/Seller/ozon-seller.controller';
import { OzonSellerService } from 'src/Modules/Seller/ozon_seller.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { DuplicateChecker } from 'src/utils/duplicateChecker';
import { OzonScheduler } from 'src/scheduler/ozon.scheduler';
import { StockRepository } from './repositories/stock-warehouse.repository';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { ProductRepository } from './repositories/productList.repository';
import { JournalErrorsRepository } from '../Errors/repositories/error.repository';
import { JournalErrorsService } from '../Errors/errors.service';

@Module({
  controllers: [SellerController],
  providers: [
    OzonSellerService,
    PrismaService,
    DuplicateChecker,
    OzonScheduler,
    SellerController,
    StockRepository,
    AnalyticsRepository,
    TransactionRepository,
    ProductRepository,
    JournalErrorsRepository,
    JournalErrorsService
  ],
  exports: [StockRepository, AnalyticsRepository, TransactionRepository, ProductRepository]
})
export class SellerModule {}