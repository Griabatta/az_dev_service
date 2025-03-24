import { Module } from '@nestjs/common';
import { SellerController } from 'src/Modules/Seller/ozon-seller.controller';
import { OzonSellerService } from 'src/Modules/Seller/ozon_seller.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { DuplicateChecker } from 'src/utils/duplicateChecker';
import { OzonScheduler } from 'src/scheduler/ozon.scheduler';

@Module({
  controllers: [SellerController],
  providers: [
    OzonSellerService,
    PrismaService,
    DuplicateChecker,
    OzonScheduler,
    SellerController // Add SellerController as a provider
  ],
})
export class SellerModule {}