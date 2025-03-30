import { Controller, Logger } from "@nestjs/common";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { reportDto } from "./models/report.dto";
import { ReportService } from "./report.service";

@Controller()
export class ReportController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportDTO: reportDto,
    private readonly report: ReportService
  ) {}

  async reportCheck() {
    const check = await this.report.ReportCheker();
    Logger.log(check)
  }

}