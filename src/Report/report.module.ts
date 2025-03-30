import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JournalErrorsModule } from "src/Modules/Errors/errors.module";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";
import { reportDto } from "./models/report.dto";
import { OzonPerformanceService } from "src/Modules/performance/ozon_performance.service";
import { DuplicateChecker } from "src/utils/duplicateChecker";




@Module({
  imports: [HttpModule, JournalErrorsModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService, reportDto, OzonPerformanceService, DuplicateChecker],
  exports: [ReportService, reportDto]
})
export class ReportModule {}