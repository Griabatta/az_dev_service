import { forwardRef, Module } from "@nestjs/common";
import { SellerModule } from "../Seller/seller.module";
import { PrismaModule } from "../Prisma/prisma.module";
import { ReviewService } from "../Seller/ozon_review.service";
import { TaskService } from "./tasks.service";
import { TaskSchedule } from "./tasks.scheduler";
import { PerformanceModule } from "../performance/performance.module";


@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SellerModule),
    forwardRef(() => PerformanceModule)
  ],
  providers: [TaskService, TaskSchedule],
  exports: [TaskService, TaskSchedule]
})

export class TaskModule {}