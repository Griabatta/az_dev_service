import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { BundleModule } from "../utils/bundle/bundle.module";
import { ReportModule } from "../utils/report/report.module";
import { TokenModule } from "../utils/token/token.module";
import { PerformanceTaskService } from "./performance.corsJob";
import { PerformanceModule } from "../performance.module";
import { SheduleCronModule } from "src/scheduler/shedule.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => BundleModule),
    forwardRef(() => ReportModule),
    forwardRef(() => TokenModule),
    forwardRef(() => PerformanceModule),
    forwardRef(() => SheduleCronModule)
  ],
  providers: [PerformanceTaskService], 
  exports: [PerformanceTaskService]
})
export class PerformanceScheduleModule {}