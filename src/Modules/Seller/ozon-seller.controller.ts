import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { OzonSellerService } from './ozon_seller.service';
import { PrismaService } from '../Prisma/prisma.service';
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

  @Post('/fetch-and-import')
  async fetchAndImport() {
    let result: boolean = false;
    try {
      const users = await this.fetchUserData();
      for (const user of users) {
        const clientId = await decrypt(user.clientId);
        const apikey = await decrypt(user.apiKey);

        const headers: headerDTO = {
          clientId: clientId,
          apiKey: apikey,
          userId: String(user.id)
        };
        result = await this.OzonSellerService.fetchDataAndSave(headers);
        
      }
      if (result) {
        Logger.log({ message: 'Data fetched and imported successfully' });
      } 
    } catch (error) {
        Logger.error(error.message);
    }
  }

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
      const data = await this.OzonSellerService.getAnalyst(headers, req);
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: error.message });
    };
  };

  // @Post('import/analytics')
  // async importAnalytics(
  //   @Headers('Client-Id') clientId: string ,
  //   @Headers('Api-Key') apiKey: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const headers: headerDTO = {
  //     'Client-Id': clientId,
  //     'Api-Key': apiKey,
  //   };

  //   try {
  //     const data = await this.OzonSellerService.fetchAndImportAnalytics(2, headers, req, res);
  //     res.json(data);
  //   } catch (error) {
  //     res.status(500).send({ message: error.message });
  //   };
    
  // }

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
  
  // @Post('import/stock')
  // async importStock(
  //   @Headers('Client-Id') clientId: string ,
  //   @Headers('Api-Key') apiKey: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const headers: headerDTO = {
  //     'Client-Id': clientId,
  //     'Api-Key': apiKey,
  //   };
    
  //   try {
  //     const data = await this.OzonSellerService.fetchAndImportStock(2, headers, req, res);
  //     res.json(data);
  //   } catch (error) {
  //     res.status(500).send({ message: error.message });
  //   }
  // }

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

  // @Post('import/transactions')
  // async importTransactions(
  //   @Headers('Client-Id') clientId: string ,
  //   @Headers('Api-Key') apiKey: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const headers: headerDTO = {
  //     'Client-Id': clientId,
  //     'Api-Key': apiKey,
  //   };

  //   try {
  //     const data = await this.OzonSellerService.fetchAndImportTransaction(2, headers, req, res);
  //     res.json(data);
  //   } catch (error) {
  //     res.status(500).send({ message: error.message });
  //   }
  // }

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

  // @Post('import/product-list')
  // async importProductList(
  //   @Headers('Client-Id') clientId: string ,
  //   @Headers('Api-Key') apiKey: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const headers: headerDTO = {
  //     'Client-Id': clientId,
  //     'Api-Key': apiKey,
  //   };

  //   try {
  //     const data = await this.OzonSellerService.fetchAndImportProduct(2, headers, req, res);
  //     res.json(data);
  //   } catch (error) {
  //     res.status(500).send({ message: error.message });
  //   }
  // }

  //----------------END PRODUCT LIST-------------------


}