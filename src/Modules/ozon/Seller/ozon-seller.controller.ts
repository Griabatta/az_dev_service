import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonSellerService } from './ozon_seller.service';
import { PrismaService } from '../../../Prisma/prisma.service';
import { decrypt } from 'src/tools/data.crypt';
import { headerDTO } from './models/seller.dto';

@Controller('/api/seller')
export class SellerController {
  constructor(
    private readonly OzonSellerService: OzonSellerService,
    private readonly prisma: PrismaService
  ) {}

  async fetchUserData() {
    return await this.prisma.user.findMany();
  }
  //-----------------Sku-----------------------

  @Post('/sku')
  async SkuListImport(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const data = await this.OzonSellerService.fetchAndImportSKUList(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
  };

  //----------------StockAnalyitcs------------------

  @Post('/stockAnalyt')
  async StockAnalytics(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const data = await this.OzonSellerService.fetchAndImportStockAnalytics(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
  };

  //----------------ANALYTICS-------------------

  @Post('/analytics')
  async Analyst(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const data = await this.OzonSellerService.fetchAndImportAnalytics(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
  };

  //----------------END ANALYTICS-------------------

  //----------------STOCK-------------------

  @Post('/stock')
  async Stock(
    @Headers('Client-Id') clientId: string ,
    @Headers('Api-Key') apiKey: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const headers: headerDTO = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
    };
    
    try {
      const data = await this.OzonSellerService.fetchAndImportStock(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  
  

  //----------------END STOCK-------------------

  //----------------TRANSACTION-------------------

  @Post('/transactions')
  async Transactions(
    @Headers('Client-Id') clientId: string ,
    @Headers('Api-Key') apiKey: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const headers: headerDTO = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
    };

    try {
      const data = await this.OzonSellerService.fetchAndImportTransaction(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }  

  //----------------END TRANSACTION-------------------

  //----------------PRODUCT LIST-------------------
  @Post('/product-list')
  async ProductList(
    @Headers('Client-Id') clientId: string ,
    @Headers('Api-Key') apiKey: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const headers: headerDTO = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
    };

    try {
      const data = await this.OzonSellerService.fetchAndImportProduct(undefined, req.body.userId, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  //----------------END PRODUCT LIST-------------------


}