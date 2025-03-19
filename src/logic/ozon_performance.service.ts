import { Injectable, Req, Res } from '@nestjs/common';
import { fetchCl } from './fetch';
import { AxiosResponse } from 'axios';
import { headerDTO } from 'src/entities/dto/fetch-ozon.dto';
import { Request, Response } from 'express';

@Injectable()
export class OzonPerformanceService {
  private fetchCl: fetchCl;
  constructor() {
    this.fetchCl = new fetchCl();
  }

  async getPerformanceToken(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response,
    payload
  ): Promise<AxiosResponse<any>> {
    if (!headers.clientId || !headers.clientSecret) {
      res.status(401).send({ message: "Unauthorized" });
    }
    const url = 'https://api-performance.ozon.ru/api/client/token';

    const data = await this.fetchCl.fetchPost(url, headers, payload);
    return data;
  }
}