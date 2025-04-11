import { forwardRef, Module } from "@nestjs/common";
import { PerformanceController } from "./ozon-performance.controller";
import { OzonPerformanceService } from "./ozon_performance.service";
import { PerformanceScheduleModule } from "./shedule/performance_shedule.module";
import { PerformanceRepository } from "./repositories/performance.repository";
import { JournalErrorsModule } from "../Errors/errors.module";
import { PrismaModule } from "../Prisma/prisma.module";
import { PerformanceCampaingsRep } from "./repositories/campaings.repostiroty";
import { TokenModule } from "./utils/token/token.module";
import { UserModule } from "../Auth/user.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SellerModule } from "../Seller/seller.module";


@Module({
  imports: [

    ScheduleModule.forRoot(),
    PerformanceScheduleModule,
    JournalErrorsModule,
    PrismaModule,
    forwardRef(() => TokenModule),
    forwardRef(() => UserModule),
    forwardRef(() => SellerModule)

  ],
  providers: [
    OzonPerformanceService,
    PerformanceRepository,
    PerformanceCampaingsRep
  ],
  exports: [
    OzonPerformanceService,
    PerformanceRepository,
    PerformanceCampaingsRep
  ]
})
export class PerformanceModule {}