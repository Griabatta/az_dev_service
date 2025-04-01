import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BundleModule } from "../utils/bundle/bundle.module";
import { ReportModule } from "../utils/report/report.module";
import { TokenModule } from "../utils/token/token.module";
import { PerformanceTaskService } from "./performance.corsJob";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BundleModule,
    ReportModule,
    TokenModule
  ],
  providers: [PerformanceTaskService], 
  exports: [PerformanceTaskService]
})
export class PerformanceScheduleModule {}