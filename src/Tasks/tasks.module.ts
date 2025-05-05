import { forwardRef, Module } from "@nestjs/common";
import { SellerModule } from "../Modules/ozon/Seller/seller.module";
import { PrismaModule } from "../Prisma/prisma.module";
import { ReviewService } from "../Modules/ozon/Seller/ozon_review.service";
import { TaskService } from "./tasks.service";
import { TaskSchedule } from "./tasks.scheduler";
import { PerformanceModule } from "../Modules/ozon/performance/performance.module";
import { SheduleCronModule } from "src/scheduler/shedule.module";


@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SellerModule),
    forwardRef(() => PerformanceModule),
    forwardRef(() => SheduleCronModule)
  ],
  providers: [TaskService, TaskSchedule],
  exports: [TaskService, TaskSchedule]
})

export class TaskModule {}