import { Injectable, Logger, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { stockDTO, analystDTO, transactionDTO, productListDTO, headerDTO } from 'src/entities/dto/fetch-ozon.dto';
import { Request, Response } from 'express';
import { CreateAnalyticsDto, CreateProductDto, CreateStockDto, CreateTransactionDto } from 'src/Modules/Seller/models/create-seller.dto';
import { PrismaService } from '../Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DuplicateChecker } from '../../utils/duplicateChecker';
import { AnalyticsRepository } from './repositories/analytics.repository';
import { StockRepository } from './repositories/stock-warehouse.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { ProductRepository } from './repositories/productList.repository';
import { JournalErrorsService } from '../Errors/errors.service';

@Injectable()
export class OzonSellerService {

  
  constructor(
    
    private readonly duplicateChecker: DuplicateChecker,
    private readonly repAnalyt: AnalyticsRepository,
    private readonly repStock: StockRepository,
    private readonly repTrans: TransactionRepository,
    private readonly repProduct: ProductRepository,
    private readonly erorrs: JournalErrorsService
  ) {}


  //_________________________________ANALYTICS_________________________________
  //-----------RESPONSE--------------
  async getAnalyst(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateAnalyticsDto[] | string> {
    const {clientId, apiKey, userId} = headers;

    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      return (`Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);
    };

    const url = 'https://api-seller.ozon.ru/v1/analytics/data';
    const { datefrom, dateto, dimension, filters, sort, limit, offset, metrics } = req?.body || {};
    
    const dateNow = new Date();
    const date_from = datefrom || new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString().slice(0, 10); // За последний месяц
    const date_to = dateto || dateNow.toISOString().slice(0, 10);
    const defaultMetrics = ['revenue', 'ordered_units'];
    const defaultDimensions = ['sku', 'day'];
    
    const metricTemplate = {
      "revenue": 0,
      "ordered_units": 0,
      "unknown_metric": 0,
      "hits_view_pdp": 0,
      "hits_view": 0,
      "hits_tocart_search": 0,
      "hits_tocart_pdp": 0,
      "hits_tocart": 0,
      "session_view_search": 0,
      "session_view_pdp": 0,
      "session_view": 0,
      "conv_tocart_search": 0,
      "conv_tocart_pdp": 0,
      "conv_tocart": 0,
      "returns": 0,
      "cancellations": 0,
      "delivered_units": 0,
      "position_category": 0,
    };

    const body: analystDTO = {
      "date_from": date_from,
      "date_to": date_to,
      "dimension": dimension || defaultDimensions,
      "filters": filters || [],
      "sort": sort || [{}],
      "limit": limit || 1000,
      "offset": offset || 0,
      "metrics": metrics || defaultMetrics
    };
    const httpHeader = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };

    try {

      Logger.log("-------------------------------");
      Logger.log("------ANALYTICS------");
      Logger.log("Request data..");
      const response = await axios.post(url, body, { headers: httpHeader });
      Logger.log("Data received.");
      Logger.log("Start data conversion..");
      const formatingData = response.data.result.data;
      
      const result: CreateAnalyticsDto[] = formatingData.map(dates => {
        const metrics = body.metrics.reduce((acc, name, index) => {
          acc[name] = dates.metrics[index];
          return acc;
        }, {} as Record<string, number>);
        return {
          "dimensions": JSON.stringify(dates.dimensions), 
          ...metricTemplate,          
          ...metrics                   
        };
      });
      Logger.log("Data converted.");
      
      return result;
    } catch (error) {
      await this.erorrs.logError(
        {
          userId: Number(userId),
          message: String(error.message) || "Unexpected error",
          priority: 3,
          code: '500',
          serviceName: "Seller/Analytics/Data/request"
        }
      );
      return String(error.message);
    };
  };
  // ----------------IMPORT-------------------
  async importAnalytics(userId: number, analyticsData: CreateAnalyticsDto[]) {

    if (analyticsData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    };

    Logger.log("Start import..");

    const data = analyticsData.map(item => ({ // добавляем userId
      ...item,
      userId
    }));

    try {

      await this.repAnalyt.createMany(data);  // вызываем метод репозитория, что пренадлежит аналитике

      Logger.log("Import success");
      Logger.log("-------------------------------");

    } catch (error) {
      await this.erorrs.logError(
        {
          userId: Number(userId),
          message: String(error.message) || "Unexpected error",
          priority: 3,
          code: '500',
          serviceName: "Seller/Analytics/Data/import"
        }
      );
      return (`Failed to import analytics data: ${error.message}`);
    }
  }


  //_________________________________STOCK_________________________________
  //------RESPONSE-------
    async getStock(
      headers: headerDTO,
      @Req() req: Request,
      @Res() res: Response
    ): Promise<CreateStockDto[] | Promise<string>> {
      const {clientId, apiKey, userId} = headers;
      const url = 'https://api-seller.ozon.ru/v2/analytics/stock_on_warehouses';

      if (!clientId || !apiKey || !userId) {
        await this.erorrs.logUnauthorizedError(Number(userId));
        return (`Getting stock data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);
      };
      const {limit, offset, warehouse_type} = req.body || {};
      
      const body: stockDTO = {
        "limit": limit || 1000,
        "offset": offset || 0,
        "warehouse_type": warehouse_type || "ALL"
      };

      const httpHeader = {
        'Client-Id': clientId,
        'Api-Key': apiKey,
        'Content-Type': 'application/json'
      };

      try {
        Logger.log("-------------------------------");
        Logger.log("------STOCK------");
        Logger.log("Request data..");
        const response = await axios.post(url, body, { headers: httpHeader });
        Logger.log("Data received.");
        Logger.log("Start data conversion..");
        const result = response.data?.result.rows;
        Logger.log("Data converted");

        return result;
      } catch (error) {
        await this.erorrs.logError(
          {
            userId: Number(userId),
            message: String(error.message) || "Unexpected error",
            priority: 3,
            code: '500',
            serviceName: "Seller/Stock/WareHouse/request"
          }
        );
        return String(error.message);
      };
    };

  //------IMPORT-------
  async importStock(userId: number, stockData: CreateStockDto[]) {
    
    if (stockData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    }

    Logger.log("Start import..")

    const data = stockData.map(item => ({
      ...item,
      userId
    }));

    try {

      await this.repStock.createMany(data)

      Logger.log("Import success");
      Logger.log("-------------------------------")

    } catch (error) {

        await this.erorrs.logError(
          {
            userId: Number(userId),
            message: String(error.message) || "Unexpected error",
            priority: 3,
            code: '500',
            serviceName: "Seller/Stock/WareHouse/import"
          }
        );
        return (`Failed to import stocks data: ${error.message}`);
    }
  }

  // ----------RESPONSE&&IMPORT---------
  // async fetchAndImportStock(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
  //   headers.userId = String(userId);
  //   const stockData = await this.getStock(headers, req, res);
  //   await this.importStock(userId, stockData);
  // }


  //_________________________________TRANSACTION_________________________________
  //--------RESPONSE--------
  async getTransactions(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateTransactionDto[] | Promise<string>> {
    const url = 'https://api-seller.ozon.ru/v3/finance/transaction/list';
    const {operation_type, posting_number, transaction_type, page, page_size} = req.body || {};
    const {dateto, datefrom} = req.body?.filter.date || {};
    const {clientId, apiKey, userId} = headers;

    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      return (`Getting transaction data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);;
    };

    const dateNow = new Date();
    const date_from = datefrom ||  new Date(dateNow.setMonth(dateNow.getMonth() - 1)).toISOString(); // За последний месяц
    const date_to = dateto || dateNow.toISOString();

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
    
    const httpHeader = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };

    try {
      Logger.log("-------------------------------")
      Logger.log("------TRANSACTION------")
      Logger.log("Request data..");
      const response = await axios.post(url, body, { headers: httpHeader });
      Logger.log("Data received.");
      Logger.log("Start data conversion..");

      const page = response.data.result.page_count;
      let data = response.data.result.operations;

      

      if (page > 1) {
        for (let i = 2; page >= i; i++) {
          const updatedBody = { ...body, page: i };
          const nextPageResponse = await axios.post(url, updatedBody, { headers });
          data = [...data, ...nextPageResponse.data.result.operations];
        }
      };

      let result:CreateTransactionDto[] = [];

      result.push(
        ...data.map((item:any) => {
          item.operation_id = String(item.operation_id) || null;
          item.delivery_schema = item.posting.delivery_schema || "";
          item.order_date = item.posting.order_date  || "";
          item.posting_number = item.posting.posting_number  || "";
          item.warehouse_id = String(item.posting.warehouse_id) || 0;
          delete item.posting
          item.items = JSON.stringify(item.items) || Prisma.JsonNull;
          item.services = JSON.stringify(item.services) || Prisma.JsonNull;
          return item
        })
      )
      Logger.log("Data converted.")

      return result;
    } catch (error) {
      await this.erorrs.logError(
        {
          userId: Number(userId),
          message: String(error.message) || "Unexpected error",
          priority: 3,
          code: '500',
          serviceName: "Seller/Transactions/request"
        }
      );
      return String(error.message);
    };
  };
  //------IMPORT-------
  async importTransaction(userId: number, transactionData: CreateTransactionDto[]) {

    if (transactionData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    }

    const data = transactionData.map(item => ({
      ...item,
      userId
    }));

    Logger.log("Start import..");

    try {

      await this.repTrans.createMany(data);
      
      Logger.log("Import Success");
      Logger.log("-------------------------------")

    } catch (error) {

      if (error.status === 500) {
        await this.erorrs.logError(
          {
            userId: Number(userId),
            message: String(error.message) || "Unexpected error",
            priority: 3,
            code: '500',
            serviceName: "Seller/Transactions/import"
          }
        );
      }
      return (`Failed to import analytics data: ${error.message}`);
    }
  }

  // // ----------RESPONSE&&IMPORT---------
  // async fetchAndImportTransaction(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
  //   headers.userId = String(userId);
  //   Logger.log("Start Transaction..")
  //   const transactionData = await this.getTransactions(headers, req, res);
  //   await this.importTransaction(userId, transactionData);
  //   Logger.log("\nTransaction end.")
  // }


  //_________________________________PRODUCT_________________________________
  //-------RESPONSE-------
  async getProduct(
    headers: headerDTO,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<CreateProductDto[] | Promise<string>> {
    const {clientId, apiKey, userId} = headers;
    
    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      return (`Getting products data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);
    };
    const url = 'https://api-seller.ozon.ru/v3/product/list';
    const {offer_id, product_id, visibility, last_id, limit} = req.body || {};

    const body: productListDTO = {
      "filter": {
        "offer_id": offer_id || [],
        "product_id": product_id || [],
        "visibility": visibility || "ALL"
      },
      "last_id": last_id || "",
      "limit": limit || 100
    };
    
    const httpHeader = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };

    try {
      Logger.log("-------------------------------");
      Logger.log("------Product------");
      Logger.log("Request data..");

      const response = await axios.post(url, body, { headers: httpHeader });

      Logger.log("Data received.");
      Logger.log("Start data conversion..");

      const last_id = response.data.result.last_id;
      let productData: CreateProductDto[] = response.data.result.items.map(item => ({
        ...item,
        product_id: String(item.product_id), // Преобразуем в строку
        offer_id: String(item.offer_id)
      }));

      if (last_id) { // Проверяем last_id на наличие значения
        const updatedBody = { ...body, last_id };
        const nextPageResponse = await axios.post(url, updatedBody, { headers: httpHeader });
        const nextPageItems = nextPageResponse.data.result.items.map(item => ({
          ...item,
          product_id: String(item.product_id),
          offer_id: String(item.offer_id)
        }));
        productData = [...productData, ...nextPageItems];
      }

      for (let item of productData) {
        const quants = item.quants;
        item.quants = JSON.stringify(quants);
      };

      Logger.log("Data converted.");
      Logger.log("-------------------------------")

      return productData;

    } catch (error) {

      await this.erorrs.logError(
        {
          userId: Number(userId),
          message: String(error.message) || "Unexpected error",
          priority: 3,
          code: '500',
          serviceName: "Seller/ProductList/request"
        }
      );
      return String(error.message);
    }
  }
  //------IMPORT-------
  async importProduct(userId: number, productData: CreateProductDto[]) {
      
    if (productData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    };

    const data = productData.map(item => ({
      ...item,
      userId
    }));

    Logger.log("Start import..");

    try {

      await this.repProduct.createMany(data);
      
      Logger.log("Import Success");
      Logger.log("-------------------------------")

    } catch (error) {

      await this.erorrs.logError(
        {
          userId: Number(userId),
          message: String(error.message) || "Unexpected error",
          priority: 3,
          code: '500',
          serviceName: "Seller/ProductList/import"
        }
      );
      return (`Failed to import analytics data: ${error.message}`);
    }
  }

  // ----------RESPONSE&&IMPORT---------
  // async fetchAndImportProduct(userId: number, headers: headerDTO, @Req() req: Request, @Res() res: Response) {
  //   headers.userId = String(userId);
  //   Logger.log("Start get products..")
  //   const productData = await this.getProduct(headers, req, res);
  //   await this.importProduct(userId, productData);
  //   Logger.log("\n get products end.")
  // }

  async fetchDataAndSave(headers: headerDTO) {

    Logger.log("Fetching data from Ozon API...");

    try {
      const req = {}; 
      const res = {};

      const analyticsData = await this.getAnalyst(headers, req as Request, res as Response);
      const stockData = await this.getStock(headers, req as Request, res as Response);
      const transactionData = await this.getTransactions(headers, req as Request, res as Response);
      const productData = await this.getProduct(headers, req as Request, res as Response);

      const filteredAnalyticsData = typeof analyticsData === "string"? analyticsData : await this.duplicateChecker.checkAndFilterDuplicates('analytics', analyticsData, ['dimensions', 'date_from', 'date_to']);
      const filteredStockData = typeof stockData === "string"? stockData : await this.duplicateChecker.checkAndFilterDuplicates('stock', stockData, ['sku', 'warehouse_name']);
      const filteredTransactionData = typeof transactionData === "string"? transactionData : await this.duplicateChecker.checkAndFilterDuplicates('transactions', transactionData, ['operation_id']);
      const filteredProductData = typeof productData === "string"? productData : await this.duplicateChecker.checkAndFilterDuplicates('products', productData, ['product_id']);

      const importAnalytics = typeof filteredAnalyticsData === "string"? filteredAnalyticsData : await this.importAnalytics(Number(headers.userId), filteredAnalyticsData)
      const importStock = typeof filteredStockData === "string"? filteredStockData : await this.importStock(Number(headers.userId), filteredStockData);
      const importTransaction = typeof filteredTransactionData === "string"? filteredTransactionData : await this.importTransaction(Number(headers.userId), filteredTransactionData);
      const importProduct = typeof filteredProductData === "string"? filteredProductData : await this.importProduct(Number(headers.userId), filteredProductData);

      if (importAnalytics === true && importStock === true && importTransaction === true && importProduct === true) {

        Logger.log("Data fetching and saving completed.");
        return true;
      } else {

        Logger.log(`Import status:`);
        Logger.log(`--> Analytics: ${typeof importAnalytics === "boolean"? importAnalytics : false}`);        // req      analytics
        Logger.log(`----> Errors: ${typeof importAnalytics === "string"?  importAnalytics : 'none'}`);          // errors   analytics

        Logger.log(`--> Stock_WareHouse: ${typeof importStock === "boolean"? importStock : false}`)           // req      stock
        Logger.log(`----> Errors: ${typeof importStock === "string"? importStock : 'none'}`);                   // errors   stock

        Logger.log(`--> Transactions: ${typeof importTransaction === "boolean"? importTransaction : false}`); // req      transactions
        Logger.log(`----> Errors: ${typeof importTransaction === "string"? importTransaction : 'none'}`);       // errors   transactions
        
        Logger.log(`--> Products: ${typeof importProduct === "boolean"? importProduct : false}`);             // req      product
        Logger.log(`----> Errors: ${typeof importProduct === "string"? importProduct : 'none'}`);               // errors   product

        return false;
      }
      
    } catch(e) {

      Logger.log(e)
      return false;
    }
  }
}