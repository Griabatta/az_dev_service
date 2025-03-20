
import { Module } from '@nestjs/common';
import { SellerController } from 'src/controllers/ozon-seller.controller';
import { OzonSellerService } from 'src/logic/ozon_seller.service';
import { PrismaService } from 'src/logic/prisma.service';
@Module({
  controllers: [SellerController],
  providers: [OzonSellerService, PrismaService],
})
export class SellerModule {}