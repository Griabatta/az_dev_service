import { Injectable, OnModuleInit, Res } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SellerController } from '../Modules/Seller/ozon-seller.controller';
import { ReportController } from 'src/Report/report.controller';
import { PerformanceController } from 'src/Modules/performance/ozon-performance.controller';
import { Response } from 'express';

@Injectable()
export class OzonScheduler implements OnModuleInit {
  constructor(
    private readonly sellerController: SellerController,
    private readonly campaigns: PerformanceController,
    private readonly reports: ReportController
  ) {}

  async onModuleInit() {
    // await this.handleCron();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron(@Res() res: Response) {
    // await this.sellerController.fetchAndImport();
    await this.campaigns.getCampaigns(res);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async reportChek() {
    await this.reports.reportCheck()
  }
}
