import { Injectable, Req, Res } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { headerDTO } from './models/mpstat.dto';

@Injectable()
export class OzonMpstatsService {
  // private fetch: fetchCl;
  constructor() {
    // this.fetch = new fetchCl();
  }

  async getSoinvest(
    headers: headerDTO,
    @Req() req: Request, // TODO: вместо абстрактных классов нужно использовать наши реализации с известными нам определёнными параметрами
    @Res() res: Response
  ): Promise<AxiosResponse<any>> {
    if (!headers.mpStatsToken) {
      res.status(401).send({ message: "Unauthorized" });
    }
    
    const dateNow = new Date();
    // TODO: тут мы уже пишем на typescript и должны явно и точно понимать какие поля у нас есть, ак каких нет, вольностей как в js мы тут больше не можем себе позволить
    const date_from = req.body.date_from ||  new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString().slice(0, 10); // За последний месяц // TODO: все такие значение (поседний месяц/неделю) должны быть вынесены в константу или параметр, чтобы их можно было быстро переопределить когда будет нужно
    const date_to = req.body.date_to || dateNow.toISOString().slice(0, 10);
    const sellerPath = req.body.sellerPath || undefined;
    if (!sellerPath) {
      res.status(404).send({ message: "Not found sellerPath" })
  }
    const url = `https://mpstats.io/api/oz/get/seller?path=${sellerPath}&d1=${date_from}&d2=${date_to}`
    const data = await axios.get(url, headers);
    return data;
  }
}

