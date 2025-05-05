import { Controller } from "@nestjs/common";
import { ReportService } from "./report.service";


@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async registerReport() {
    return await this.reportService.registrationReport();
  }
}