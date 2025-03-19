import { Injectable, Logger, Req, Res } from '@nestjs/common';
import { fetchCl } from './fetch';
import axios, { AxiosResponse } from 'axios';
import { stockDTO, analystDTO, transactionDTO, productListDTO, headerDTO } from 'src/entities/dto/fetch-ozon.dto';
import { Request, Response } from 'express';
import { CreateAnalyticsDto, CreateProductDto, CreateStockDto, CreateTransactionDto } from 'src/entities/dto/create-seller.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class OzonSellerService {
  private fetchCl: fetchCl;
  private readonly prisma: PrismaService
  constructor() {
    this.fetchCl = new fetchCl();
  }
  //_________________________________ANALYTICS_________________________________
  //-----------RESPONSE--------------
  async getAnalyst(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateAnalyticsDto[]> {
    const url = 'https://api-seller.ozon.ru/v1/analytics/data';
    const {datefrom, dateto, dimension, filters, sort, limit, offset, metrics} = req.body;
    const dateNow = new Date();
    const date_from = req.body.date_from ||  new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString().slice(0, 10); // За последний месяц
    const date_to = req.body.date_to || dateNow.toISOString().slice(0, 10);

    if (!headers['Client-Id'] || !headers['Api-Key']) {
      res.status(401).send({ message: "Unauthorized" });
    };

    const body: analystDTO = {
      "date_from": datefrom || date_from,
      "date_to": dateto || date_to,
      "dimension": dimension || [ 'sku', 'day'],
      "filters": filters || [],
      "sort": sort || [{}],
      "limit": limit || 1000,
      "offset": offset || 0,
      "metrics": metrics || ['revenue ', 'ordered_units']
    };
    
    try {
      const response = await axios.post(url, body, { headers });
      console.log(response.data.result.data)
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
  // ----------------IMPORT-------------------
  async importAnalytics(userId: number, analyticsData: CreateAnalyticsDto[]) {
    
    try {
      // Сохраняем каждую запись аналитики в базу данных
      console.log(analyticsData);
      // for (const data of analyticsData) {
      //   await this.prisma.analytics.create({
      //     data: {
      //       ...data,
      //       userId, 
      //     },
      //   });
      // }
    } catch (error) {
      throw new Error(`Failed to import analytics data: ${error.message}`);
    }
  }
  // ----------------RESPONSE&&IMPORT-------------
  async fetchAndImportAnalytics(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
    const analyticsData = await this.getAnalyst(headers, req, res);
    await this.importAnalytics(userId, analyticsData);
  }

  //_________________________________STOCK_________________________________
  //------RESPONSE-------
  async getStock(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateStockDto[]> {

    const url = 'https://api-seller.ozon.ru/v2/analytics/stock_on_warehouses';

    if (!headers['Client-Id'] || !headers['Api-Key']) {
      res.status(401).send({ message: "Unauthorized" });
    };

    const body: stockDTO = {
      "limit": req.body.limit || 1000,
      "offset": req.body.offset || 0,
      "warehouse_type": req.body.warehouse_type || "ALL"
    }


    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      return error.message;
    }
  }

  //------IMPORT-------
  async importStock(userId: number, stockData: CreateStockDto[]) {
    
    try {
      // Сохраняем каждую запись аналитики в базу данных
      for (const data of stockData) {
        await this.prisma.stock_Warehouse.create({
          data: {
            ...data,
            userId, 
          },
        });
      }
    } catch (error) {
      throw new Error(`Failed to import analytics data: ${error.message}`);
    }
  }

  // ----------RESPONSE&&IMPORT---------
  async fetchAndImportStock(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
    const stockData = await this.getStock(headers, req, res);
    await this.importStock(userId, stockData);
  }


  //_________________________________TRANSACTION_________________________________
  //--------RESPONSE--------
  async getTransactions(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateTransactionDto[]> {
    const url = 'https://api-seller.ozon.ru/v3/finance/transaction/list';
    const {datefrom, dateto, operation_type, posting_number, transaction_type, page, page_size} = req.body;

    if (!headers['Client-Id'] || !headers['Api-Key']) {
      res.status(401).send({ message: "Unauthorized" });
    };

    const dateNow = new Date();
    const date_from = req.body.date_from ||  new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString(); // За последний месяц
    const date_to = req.body.date_to || dateNow.toISOString();

    const body: transactionDTO = {
      "filter": {
        "date": {
          "from": datefrom || date_from,
          "to": dateto || date_to
        },
        "operation_type": operation_type || [],
        "posting_number": posting_number || "",
        "transaction_type": transaction_type || "all"
      },
      "page": page || 1,
      "page_size": page_size || 1000
    }

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
  //------IMPORT-------
  async importTransaction(userId: number, tansactionData: CreateTransactionDto[]) {
      
    try {
      // Сохраняем каждую запись аналитики в базу данных
      for (const data of tansactionData) {
        await this.prisma.transaction_List.create({
          data: {
            ...data,
            userId, 
          },
        });
      }
    } catch (error) {
      throw new Error(`Failed to import analytics data: ${error.message}`);
    }
  }

  // ----------RESPONSE&&IMPORT---------
  async fetchAndImportTransaction(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
    const transactionData = await this.getTransactions(headers, req, res);
    await this.importTransaction(userId, transactionData);
  }





  //_________________________________PRODUCT_________________________________
  //-------RESPONSE-------
  async getProduct(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateProductDto[]> {
    if (!headers['Client-Id'] || !headers['Api-Key']) {
      res.status(401).send({ message: "Unauthorized" });
    };
    const url = 'https://api-seller.ozon.ru/v3/product/list';
    const {offer_id, product_id, visibility, last_id, limit} = req.body;

    const body: productListDTO = {
      "filter": {
        "offer_id": offer_id || [],
        "product_id": product_id || [],
        "visibility": visibility || "ALL"
      },
      "last_id": last_id || "",
      "limit": limit || 100
    };
    
    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
  //------IMPORT-------
  async importProduct(userId: number, tansactionData: CreateProductDto[]) {
      
    try {
      // Сохраняем каждую запись аналитики в базу данных
      for (const data of tansactionData) {
        await this.prisma.product_List.create({
          data: {
            ...data,
            userId, 
          },
        });
      }
    } catch (error) {
      throw new Error(`Failed to import analytics data: ${error.message}`);
    }
  }

  // ----------RESPONSE&&IMPORT---------
  async fetchAndImportProduct(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
    const productData = await this.getProduct(headers, req, res);
    await this.importProduct(userId, productData);
  }
  

}