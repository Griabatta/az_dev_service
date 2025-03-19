import { Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonPerformanceService } from '../logic/ozon_performance.service';

@Controller('/api/performance')
export class PerformanceController {
  constructor(private readonly ozonPerformanceService: OzonPerformanceService) {}

  @Post('/performance-token')
  async PerformanceToken(
    @Headers('Client-Id') clientId: string ,
    @Headers('Client-Secret') clientSecret: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const headers = {
      'Content-Type': 'application/json',
    };

    const payload = {
      "client_id": clientId,
      "client_secret": clientSecret,
      "grant_type": 'client_credentials'
    };

    try {
      const data = await this.ozonPerformanceService.getPerformanceToken(headers, req, res, payload);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}