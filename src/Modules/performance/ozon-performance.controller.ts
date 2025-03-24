import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonPerformanceService } from './ozon_performance.service';

@Controller('/api/performance')
export class PerformanceController {
  constructor(private readonly ozonPerformanceService: OzonPerformanceService) {}

  @Post('/performance-token')
  async PerformanceToken(
    @Body('client_id') clientId: string,
    @Body('client_secret') clientSecret: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const headers = {
      'Content-Type': 'application/json',
      clientId: clientId,
      clientSecret: clientSecret,
      userId: 2, // Пример userId
    };

    try {
      const data = await this.ozonPerformanceService.getPerformanceToken(headers);
      res.status(200).json(data); // Отправляем успешный ответ
    } catch (error) {
      res.status(500).send({ message: error.message }); // Отправляем ошибку
    }
  }

  @Post('import/performance-token')
  async importPerformanceToken(
    @Headers('Client-Id') clientId: string ,
    @Headers('Client-Secret') clientSecret: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    let headers = {
      'Content-Type': 'application/json',
      clientId: clientId,
      clientSecret: clientSecret,
      'userId': 2
    };

    try {
      const data = await this.ozonPerformanceService.fetchAndImportPerfToken(2,headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}