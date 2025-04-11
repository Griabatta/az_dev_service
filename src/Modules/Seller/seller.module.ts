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
import { GoogleSheetsModule } from '../exporter/exports.module';
import { ReviewService } from './ozon_review.service';
import { PrismaModule } from '../Prisma/prisma.module';
import { PerformanceModule } from '../performance/performance.module';
import { generalForSeller } from './repositories/general';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JournalErrorsModule,
    PrismaModule,
    forwardRef(() => GoogleSheetsModule),
    forwardRef(() => PerformanceModule),
  ],
  controllers: [SellerController],
  providers: [
    OzonSellerService,
    DuplicateChecker,
    OzonScheduler,
    SellerController,
    StockRepository,
    AnalyticsRepository,
    TransactionRepository,
    ProductRepository,
    ReviewService,
    generalForSeller
  ],
  exports: [StockRepository, AnalyticsRepository, TransactionRepository, ProductRepository, OzonSellerService, ReviewService]
})
export class SellerModule {}