import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SellerController } from '../Modules/Seller/ozon-seller.controller';
import { Request, Response } from 'express';

@Injectable()
export class OzonScheduler implements OnModuleInit {
  constructor(private readonly sellerController: SellerController) {}

  async onModuleInit() {
    await this.handleCron();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron() {
    await this.sellerController.fetchAndImport();
  }
}
