import { Injectable, Req, Res } from '@nestjs/common';
import { fetchCl } from './fetch';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { headerDTO } from 'src/entities/dto/fetch-ozon.dto';

@Injectable()
export class OzonMpstatsService {
  private fetch: fetchCl;
  constructor() {
    this.fetch = new fetchCl();
  }

  async getSoinvest(
    headers:headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<AxiosResponse<any>> {
    if (!headers.mpStatsToken) {
      res.status(401).send({ message: "Unauthorized" });
    }
    
    const dateNow = new Date();
    const date_from = req.body.date_from ||  new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString().slice(0, 10); // За последний месяц
    const date_to = req.body.date_to || dateNow.toISOString().slice(0, 10);
    const sellerPath = req.body.sellerPath || undefined;
    if (!sellerPath) {
      res.status(404).send({ message: "Not found sellerPath" })
  }
    const url = `https://mpstats.io/api/oz/get/seller?path=${sellerPath}&d1=${date_from}&d2=${date_to}`
    const data = await this.fetch.fetchGet(url, headers);
    return data;
  }
}

