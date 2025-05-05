import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TokenService } from "../utils/token/token.service";
import { ReportService } from "../utils/report/report.service";
import { BundleService } from "../utils/bundle/bundle.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OzonPerformanceService } from "../ozon_performance.service";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class PerformanceTaskService implements OnModuleInit {
  private readonly logger = new Logger(PerformanceTaskService.name);

  constructor(
    private readonly token: TokenService,
    private readonly report: ReportService,
    private readonly bundle: BundleService,
  ) {}

  async onModuleInit() {
    // this.updateToken();
    // this.createBundle();
    // users.map(async user => {
    //   const campaigns = 
    // })
    // // this.getCampaigns();
    // this.createBundle();
  };

  

  // @Cron('*/25 * * * *')
  // async updateToken() {
  //   try {
  //     await this.token.updateTokens();
  //   } catch (error) {
  //     this.logger.error('Token update failed', error.code || error.status || error.message || error.text);
  //   }
  // }

  // // @Cron(CronExpression.EVERY_5_HOURS)
  // // async getCampaigns() {
  // //   await this.perfor.getCampaigns();
  // // }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async checkReport() {
  //   await this.report.registrationReport();
  // }

  // @Cron(CronExpression.EVERY_5_HOURS)
  // async createBundle() {
  //   await this.bundle.registerBundleForAllUsers();
  // }

  // @Cron('*/5 * * * *')
  // async chekReadyReport() {
  //   await this.report.chekReadyReport();
  // }
}