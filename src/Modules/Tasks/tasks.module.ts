import { Module } from "@nestjs/common";
import { SellerModule } from "../Seller/seller.module";
import { PrismaModule } from "../Prisma/prisma.module";
import { ReviewService } from "../Seller/ozon_review.service";
import { TaskService } from "./tasks.service";


@Module({
  imports: [
    PrismaModule,
    SellerModule,
    ReviewService
  ],
  providers: [
    TaskService,
  ],
  exports: [TaskService]
})

export class TaskModule {}