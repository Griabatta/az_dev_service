import { forwardRef, Module } from '@nestjs/common';
import { SellerController } from 'src/Modules/Seller/ozon-seller.controller';
import { OzonSellerService } from 'src/Modules/Seller/ozon_seller.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { DuplicateChecker } from 'src/utils/duplicateChecker';
import { OzonScheduler } from 'src/scheduler/ozon.scheduler';
import { StockRepository } from './repositories/stock-warehouse.repository';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { ProductRepository } from './repositories/productList.repository';
import { UserModule } from '../Auth/user.module';
import { JournalErrorsModule } from '../Errors/errors.module';
import { PerformanceModule } from '../performance/performance.module';
import { GoogleSheetsModule } from '../exporter/exports.module';
import { ReviewService } from './ozon_review.service';

@Module({
  imports: [
    UserModule,
    JournalErrorsModule,
    PerformanceModule,
    forwardRef(() => GoogleSheetsModule)
  ],
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
    ReviewService
  ],
  exports: [StockRepository, AnalyticsRepository, TransactionRepository, ProductRepository, OzonSellerService, ReviewService]
})
export class SellerModule {}