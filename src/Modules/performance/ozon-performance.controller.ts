// performance/performance.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { GetTemplatesRequestDto, TemplateResponseDto } from './models/performance.dto';
import { OzonPerformanceService } from './ozon_performance.service';
import { PrismaService } from '../Prisma/prisma.service';
import { decrypt } from 'src/tools/data.crypt';
import { headerDTO } from '../Seller/models/seller.dto';
import { Response } from 'express';

@Controller('/performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: OzonPerformanceService,
    private readonly prisma: PrismaService
  ) {}

  async fetchUserData() {
    return await this.prisma.user.findMany();
  }

  @Post('/templates')
  async getCampaigns(@Res() res: Response) {
    const users = await this.fetchUserData();
    for (const user of users) {

      const clientId = await decrypt(user.clientPerforId || "");
      const apikey = await decrypt(user.clientSecret || "");

      const headers: headerDTO = {
        clientPerForId: clientId,
        clientSecret: apikey,
        userId: String(user.id)
      };
      const result = await this.performanceService.getAllCampaings(headers, res);;
      // res
    }
  }
  async setReports(@Res() res: Response) {
    const users = await this.fetchUserData();
    for (const user of users) {
      const result = await this.performanceService.sendStatisticsInReport(user.id);;
      res.send(result);
    }
  }
}