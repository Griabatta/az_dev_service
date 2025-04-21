import { Injectable, Logger } from "@nestjs/common";
import { ReportRepository } from "./repositories/report.repository";
import { reportDto } from "./models/report.dto";
import { JournalErrorsService } from "src/Modules/Errors/errors.service";
import axios from "axios";
import { OzonPerformanceService } from "src/Modules/performance/ozon_performance.service";

@Injectable()
export class ReportService {
  constructor(
    private readonly errorsRepo: JournalErrorsService,
    private readonly reportRep: ReportRepository,
    private readonly token: OzonPerformanceService
    ) {}

  async sendReport(data: reportDto) {
    return await this.reportRep.createReport(data);
  };

  async deleteReport(id: number) {
    return await this.reportRep.deleteReportById(id);
  };

  async getAllReport() {
    return await this.reportRep.getAllReports();
  };

  async updateReport(id: number, data: reportDto) {
    return await this.reportRep.updateReport(id, data);
  };

  async getReportByUUID(uuid: string) {
    return await this.reportRep.getReportByUUID(uuid);
  };

  async ReportCheker() {
    const reports = await this.getAllReport();
    const apiUrl = `https://api-performance.ozon.ru:443/api/client/statistics/`;

    reports.map(async report => {
        const token = await this.token.getAccessToken({userId: String(report.userId)})
        const reportStatus = report.status;
        if (reportStatus === "In Progress") {
            try {
                const uuid = report.uuid;
                const headers = {
                    "Authorization": `Bearer ${token}`
                }

                // TODO: надо подумать в сторону того чтобы уйти от axios в пользу rxjs
                const response = await axios.get(`${apiUrl}${uuid}`, {headers}); 
                Logger.log(response);
            } catch(e) {
                Logger.log(e);
            }
        }
    })
  }


}