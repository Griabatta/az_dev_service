import { Body, Controller, Get, Headers, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonMpstatsService } from '../logic/ozon_mpstats.service';
 
@Controller('/api/mpstat')
export class MpstatsController {
  constructor(private readonly ozonMpstatsService: OzonMpstatsService) {}

  @Post('/soinvest')
  async Soinvest(
    @Headers('x-mpstats-token') mpStatsToken: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const headers = {
      'X-Mpstats-TOKEN': mpStatsToken,
      'Content-Type': 'application/json',
    };
    try {
      const data = await this.ozonMpstatsService.getSoinvest(headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}