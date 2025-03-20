import { Body, Controller, Logger, Post, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonSellerService } from '../logic/ozon_seller.service';
import { stockDTO, analystDTO, transactionDTO, productListDTO, headerDTO } from 'src/entities/dto/fetch-ozon.dto';

@Controller('/api/seller')
export class SellerController {
  constructor(private readonly OzonSellerService: OzonSellerService) {}
  //----------------ANALYTICS-------------------

  @Post('/analytics')
  async Analyst(
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
      const data = await this.OzonSellerService.getAnalyst(headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
  };

  @Post('import/analytics')
  async importAnalytics(
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
      const data = await this.OzonSellerService.fetchAndImportAnalytics(2, headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
    
  }

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
      const data = await this.OzonSellerService.getStock(headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  
  @Post('import/stock')
  async importStock(
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
      const data = await this.OzonSellerService.fetchAndImportStock(2, headers, req, res);
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
      const data = await this.OzonSellerService.getTransactions(headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  @Post('import/transactions')
  async importTransactions(
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
      const data = await this.OzonSellerService.fetchAndImportTransaction(2, headers, req, res);
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
      const data = await this.OzonSellerService.getProduct(headers, req, res);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


  //----------------END PRODUCT LIST-------------------
  


  

}