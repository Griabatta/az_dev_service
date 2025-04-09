import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BundleModule } from "../utils/bundle/bundle.module";
import { ReportModule } from "../utils/report/report.module";
import { TokenModule } from "../utils/token/token.module";
import { PerformanceTaskService } from "./performance.corsJob";
import { PerformanceModule } from "../performance.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BundleModule,
    ReportModule,
    TokenModule,
    forwardRef(() => PerformanceModule)
  ],
  providers: [PerformanceTaskService], 
  exports: [PerformanceTaskService]
})
export class PerformanceScheduleModule {}