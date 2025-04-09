import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TokenService } from "../utils/token/token.service";
import { ReportService } from "../utils/report/report.service";
import { BundleService } from "../utils/bundle/bundle.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OzonPerformanceService } from "../ozon_performance.service";


@Injectable()
export class PerformanceTaskService implements OnModuleInit {
  private readonly logger = new Logger(PerformanceTaskService.name);

  constructor(
    private readonly token: TokenService,
    private readonly report: ReportService,
    private readonly bundle: BundleService,
    private readonly perfor: OzonPerformanceService
  ) {}

  async onModuleInit() {
    this.updateToken();
    this.getCampaigns();
    this.createBundle();
  };

  

  @Cron('*/25 * * * *')
  async updateToken() {
    this.logger.log('Running token update...');
    try {
      await this.token.updateTokens();
      this.logger.log('Token update completed');
    } catch (error) {
      // this.logger.error('Token update failed', error.stack);
    }
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async getCampaigns() {
    this.logger.log("Get campaigns");
    await this.perfor.getCampaigns();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkReport() {
    this.logger.log('Registration reports...');
    await this.report.registrationReport();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async createBundle() {
    this.logger.log('Creating bundles...');
    await this.bundle.registerBundleForAllUsers();
  }

  @Cron('*/2 * * * *')
  async chekReadyReport() {
    this.logger.log('Checking ready report...')
    await this.report.chekReadyReport();
  }
}