import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { ReportRepo } from "./repository/report.repository";
import { TokenModule } from "../token/token.module";
import { BundleModule } from "../bundle/bundle.module";
import { JournalErrorsModule } from "src/Modules/Errors/errors.module";
import { PrismaModule } from "src/Modules/Prisma/prisma.module";
import { UserModule } from "src/Modules/Auth/user.module";
import { DuplicateChecker } from "src/utils/duplicateChecker";

@Module({
  imports: [
    HttpModule,
    JournalErrorsModule,
    TokenModule,
    BundleModule,
    PrismaModule,
    UserModule,
    PrismaModule
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportRepo, DuplicateChecker],
  exports: [ReportService, ReportRepo]
})
export class ReportModule {}