import { Injectable, OnModuleInit, Res } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleSheetsService } from 'src/Modules/exporter/exports.service';
import { OzonPerformanceService } from 'src/Modules/performance/ozon_performance.service';
import { OzonSellerService } from 'src/Modules/Seller/ozon_seller.service';

@Injectable()
export class OzonScheduler implements OnModuleInit {
  constructor(
    private readonly sellerController: OzonSellerService,
    private readonly campaigns: OzonPerformanceService,
    private readonly exporter: GoogleSheetsService,
  ) {}

  async onModuleInit() {
    await this.handleCron();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron() {
    await this.sellerController.fetchAndImport();
  };
  @Cron(CronExpression.EVERY_12_HOURS)
  async getCampaigns() {
    await this.campaigns.getCampaigns();
  }
  @Cron('*/10 * * * *')
  async SendDataAnalytics() {
    await this.exporter.ExportInSheet('Analytics');
  };

  @Cron('*/11 * * * *')
  async SendDataStock() {
    await this.exporter.ExportInSheet('Stock_Ware');
  };

  @Cron('*/12 * * * *')
  async SendDataTransaction() {
    await this.exporter.ExportInSheet('Transactions');
  };

  @Cron('*/12 * * * *')
  async SendDataProductList() {
    await this.exporter.ExportInSheet('ProductList');
  };

  @Cron('*/13 * * * *')
  async SendDataTrafarets() {
    await this.exporter.ExportInSheet('Trafarets');
  };

  @Cron('*/14 * * * *')
  async SendDataSearch() {
    await this.exporter.ExportInSheet('Search');
  };

  @Cron('*/15 * * * *')
  async SendDataBanner() {
    await this.exporter.ExportInSheet('Banner');
  };
  
}
