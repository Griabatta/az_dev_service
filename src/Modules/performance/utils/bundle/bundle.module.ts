import { forwardRef, Module } from "@nestjs/common";
import { BundleController } from "./bundle.controller";
import { BundleService } from "./bundle.service";
import { BundleRepo } from "./repository/bundle.repository";
import { TokenModule } from "../token/token.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PerformanceCampaingsRep } from "../../repositories/campaings.repostiroty";
import { JournalErrorsModule } from "src/Modules/Errors/errors.module";
import { PrismaModule } from "src/Modules/Prisma/prisma.module";
import { PerformanceModule } from "../../performance.module";
import { UserModule } from "src/Modules/Auth/user.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JournalErrorsModule,
    TokenModule,
    PrismaModule,
    forwardRef(() => PerformanceModule),
    forwardRef(() => UserModule)
  ],
  controllers: [BundleController],
  providers: [
    BundleService,
    BundleRepo,
    PerformanceCampaingsRep
  ],
  exports: [BundleService, BundleRepo]
})
export class BundleModule {}