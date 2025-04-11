import { Injectable, Logger, Req, Res } from '@nestjs/common';
import axios from 'axios';
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
import { analystDTO, headerDTO, metricGroups, metricTemplate, productListDTO, stockDTO, transactionDTO } from './models/seller.dto';
import { decrypt } from 'src/tools/data.crypt';
import { UserService } from '../Auth/auth.service';
import { formatISO, subDays, subMonths } from 'date-fns';

@Injectable()
export class OzonSellerService {

  private readonly logger = new Logger(OzonSellerService.name)
  
  constructor(
    
    private readonly duplicateChecker: DuplicateChecker,
    private readonly repAnalyt: AnalyticsRepository,
    private readonly repStock: StockRepository,
    private readonly repTrans: TransactionRepository,
    private readonly repProduct: ProductRepository,
    private readonly erorrs: JournalErrorsService,
    private readonly user: UserService
  ) {}
  async fetchAndImportAnalytics(user: any, userId?: number, payload?: any) {
    
    if (userId) {
      user = await this.user.getUserById(userId)
    };
    
    try {
      const clientId = await decrypt(user.clientId);
      const apikey = await decrypt(user.apiKey);
      
      const headers: headerDTO = {
        clientId: clientId,
        apiKey: apikey,
        userId: String(user.id)
      };
      
      
      const analyticsData = await this.getAnalyst(headers, payload);
      const importAnalytics = typeof analyticsData === "string" 
        ? analyticsData 
        : await this.importAnalytics(Number(headers.userId), analyticsData);

        
      return;
    } catch (error) {
      console.error(`Error for user ${user.id}:`, error);
      return false;
    }
    
  };

  async fetchAndImportStock(user: any, userId?: number, payload?: any) {

    if (userId) {
      user = await this.user.getUserById(userId)
    };

    try {
      const clientId = await decrypt(user.clientId);
      const apikey = await decrypt(user.apiKey);
      
      const headers: headerDTO = {
        clientId: clientId,
        apiKey: apikey,
        userId: String(user.id)
      };
      
      
      const stockData = await this.getStock(headers, payload);
      const importStock = typeof stockData === "string" 
        ? stockData 
        : await this.importStock(Number(headers.userId), stockData);
      return true;
    } catch (error) {
      console.error(`Error for user ${user.id}:`, error);
      return false;
    }
    
  };

  async fetchAndImportTransaction(user: any, userId?: number, payload?: any) {

    if (userId) {
      user = await this.user.getUserById(userId)
    };

    try {
      const clientId = await decrypt(user.clientId);
      const apikey = await decrypt(user.apiKey);
      
      const headers: headerDTO = {
        clientId: clientId,
        apiKey: apikey,
        userId: String(user.id)
      };
      
      const transactionData = await this.getTransactions(headers, payload);
      const importTransaction = typeof transactionData === "string" 
        ? transactionData 
        : await this.importTransaction(Number(headers.userId), transactionData);
        
      return true;
    } catch (error) {
      console.error(`Error for user ${user.id}:`, error);
      return false;
    }

  };

  async fetchAndImportProduct(user: any, userId?: number, payload?: any) {

    if (userId) {
      user = await this.user.getUserById(userId)
    };

    try {
      const clientId = await decrypt(user.clientId);
      const apikey = await decrypt(user.apiKey);
      
      const headers: headerDTO = {
        clientId: clientId,
        apiKey: apikey,
        userId: String(user.id)
      };
      
      const productData = await this.getProduct(headers, payload);
      const importProdutc = typeof productData === "string" 
        ? productData 
        : await this.importProduct(Number(headers.userId), productData);
      return true;
    } catch (error) {
      console.error(`Error for user ${user.id}:`, error);
      return false;
    }
    
  }


  async fetchAndImport() {
      let result: boolean = false;
      try {
        const users = await this.user.getAllUsers();
        for (const user of users) {
          const clientId = await decrypt(user.clientId);
          const apikey = await decrypt(user.apiKey);
  
          const headers: headerDTO = {
            clientId: clientId,
            apiKey: apikey,
            userId: String(user.id)
          };
          result = await this.fetchDataAndSave(headers);
          
        }
        if (result) {
          Logger.log({ message: 'Data fetched and imported successfully' });
        } 
      } catch (error) {
          Logger.error(error.message);
      }
    }

  //_________________________________ANALYTICS_________________________________
  //-----------RESPONSE--------------
  async getAnalyst(headers: headerDTO, @Req() req?: Request): Promise<CreateAnalyticsDto[] | string> {
    const { clientId, apiKey, userId } = headers;
  
    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      return 'Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401';
    }

    const url = 'https://api-seller.ozon.ru/v1/analytics/data';
    const { datefrom, dateto, dimension, filters, sort, limit, offset } = req?.body || {};

    const dateNow = new Date();
    const date_from = datefrom || new Date(new Date(subDays(dateNow, 7)).setHours(0,0,0,0)).toISOString();;
    const date_to = dateto || dateNow.toISOString().slice(0, 10);

    const defaultDimensions = ['sku', 'day'];

    const httpHeader = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };
    try {


      // Делаем параллельные запросы для всех групп метрик
      const requests = metricGroups.map(async metrics => {
        const body = {
          date_from,
          date_to,
          dimension: dimension || defaultDimensions,
          filters: filters || [],
          sort: sort || [{}],
          limit: limit || 1000,
          offset: offset || 0,
          metrics
        };
        
        return await axios.post(url, body, { headers: httpHeader });
      });
  
      const responses = await Promise.all(requests);
      
      // Собираем данные из всех ответов
      const allData = responses.map(r => r.data.result.data);

      // Объединяем метрики для каждого элемента
      const mergedData = allData[0].map((item, index) => {
        const baseItem = {
          dimensionsId: Number(item.dimensions[0]?.id || 0),
          dimensionsName: item.dimensions[0]?.name || 0,
          dimensionsDate: item.dimensions[1].id || "",
          ...metricTemplate // Инициализируем все метрики нулями
        };
        
        // Добавляем метрики из всех запросов
        allData.forEach((dataGroup, groupIndex) => {
          const currentItem = dataGroup[index];
          metricGroups[groupIndex].forEach((metric, metricIndex) => {
            baseItem[metric] = currentItem.metrics[metricIndex];
          });
        });
        
        return baseItem;
      });
  
      
      return mergedData;
    } catch (error) {
      await this.erorrs.logError({
        userId: Number(userId),
        message: String(error.message) || "Unexpected error",
        priority: 3,
        code: '500',
        serviceName: "Seller/Analytics/Data/request"
      });
      this.logger.error(error.message)
      this.logger.error(error.code || error)
      return String(error.message);
    }
  }
  // ----------------IMPORT-------------------
  async importAnalytics(userId: number, analyticsData: CreateAnalyticsDto[]) {

    if (analyticsData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    };

    try {
      const chunkSize = 20;
      for (let i = 0; i < analyticsData.length; i += chunkSize) {
        const chunk = analyticsData.slice(i, i + chunkSize);
        await this.repAnalyt.upsertManyAnalytics(chunk, userId);
      }
      // await this.repAnalyt.upsertManyAnalytics(analyticsData, userId);  
      

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
      this.logger.error(error.message)
      return (`Failed to import analytics data: ${error.message}`);
    }
  }


  //_________________________________STOCK_________________________________
  //------RESPONSE-------
    async getStock(
      headers: headerDTO,
      @Req() req?: Request,
      @Res() res?: Response
    ): Promise<CreateStockDto[] | Promise<string>> {
      const {clientId, apiKey, userId} = headers;
      const url = 'https://api-seller.ozon.ru/v2/analytics/stock_on_warehouses';

      if (!clientId || !apiKey || !userId) {
        await this.erorrs.logUnauthorizedError(Number(userId));
        return (`Getting stock data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);
      };
      const {limit, offset, warehouse_type} = req?.body || {};
      
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
        const response = await axios.post(url, body, { headers: httpHeader });

        const result = response.data?.result.rows;


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



    try {
      const chunkSize = 20;
      for (let i = 0; i < stockData.length; i += chunkSize) {
        const chunk = stockData.slice(i, i + chunkSize);
        await this.repStock.upsertManyStock(chunk, userId);
      }
      // await this.repStock.upsertManyStock(stockData, userId)


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
    @Req() req?: Request,
    @Res() res?: Response
  ): Promise<CreateTransactionDto[] | Promise<string>> {
    const url = 'https://api-seller.ozon.ru/v3/finance/transaction/list';
    const {operation_type, posting_number, transaction_type, page, page_size} = req?.body || {};
    
    const {dateto, datefrom} = req?.body?.filter.date || {};
    const {clientId, apiKey, userId} = headers;
    
    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      this.logger.error(`Getting transaction data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`)
      return (`Getting transaction data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);;
    };

    const dateNow = new Date();
    const date_from = datefrom ||  new Date(new Date(subDays(dateNow, 1)).setHours(0,0,0,0)).toISOString(); // За последний месяц
    const date_to = dateto || new Date(new Date().setHours(0,0,0,0)).toISOString();

    const body: transactionDTO = {
      "filter": {
          "date": {
          "from": date_from,
          "to": date_to
          },
          "operation_type": ["OperationPointsForReviews"],
          "posting_number": "",
          "transaction_type": ""
      },
      "page": 1,
      "page_size": 1000
  }

    const httpHeader = {
      'Client-Id': clientId,
      'Api-Key': apiKey,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(url, body, { headers: httpHeader });
      const page = response.data.result.page_count;
      let data = response.data.result.operations;
      
      if (page > 1) {
        for (let i = 2; page >= i; i++) {
          await new Promise(resolve => setTimeout(resolve, 5000)); 

          const updatedBody = { ...body, page: i };
          const nextPageResponse = await axios.post(url, updatedBody, { headers: httpHeader });
          data = [...data, ...nextPageResponse.data.result.operations];
        }
      }

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
      this.logger.error(error.message)
      return String(error.message);
    };
  };
  //------IMPORT-------
  async importTransaction(userId: number, transactionData: CreateTransactionDto[]) {

    if (transactionData.length === 0) {
      Logger.log("No new data to import. Data is up-to-date.");
      return true;
    }
    

    try {
      const chunkSize = 20;
      for (let i = 0; i < transactionData.length; i += chunkSize) {
        const chunk = transactionData.slice(i, i + chunkSize);
        await this.repTrans.upsertManyTransaction(chunk, userId);
      }
      // await this.repTrans.upsertManyTransaction(transactionData, userId);
      

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


  //_________________________________PRODUCT_________________________________
  //-------RESPONSE-------
  async getProduct(
    headers: headerDTO,
    @Req() req?: Request,
    @Res() res?: Response
  ): Promise<CreateProductDto[] | Promise<string>> {
    const {clientId, apiKey, userId} = headers;
    
    if (!clientId || !apiKey || !userId) {
      await this.erorrs.logUnauthorizedError(Number(userId));
      return (`Getting products data ended with an error: "Unauthorized. No Client-Id or Api-key", status: 401`);
    };
    const url = 'https://api-seller.ozon.ru/v3/product/list';
    const {offer_id, product_id, visibility, last_id, limit} = req?.body || {};

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

      const response = await axios.post(url, body, { headers: httpHeader });


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

    // const data = productData.map(item => ({
    //   ...item,
    //   userId
    // }));


    try {
      const chunkSize = 20;
      for (let i = 0; i < productData.length; i += chunkSize) {
        const chunk = productData.slice(i, i + chunkSize);
        await this.repProduct.upsertManyProduct(chunk, userId);
      }
      // await this.repProduct.upsertManyProduct(productData, userId);
      

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

      const analyticsData = await this.getAnalyst(headers, req as Request);
      const stockData = await this.getStock(headers, req as Request, res as Response);
      const transactionData = await this.getTransactions(headers, req as Request, res as Response);
      const productData = await this.getProduct(headers, req as Request, res as Response);

      const filteredAnalyticsData = typeof analyticsData === "string"? analyticsData : await this.duplicateChecker.checkAndFilterDuplicates('analytics', analyticsData, ['dimensions', 'userId', 'date_from', 'date_to']);
      const filteredStockData = typeof stockData === "string"? stockData : await this.duplicateChecker.checkAndFilterDuplicates('stock', stockData, ['sku', 'userId', 'warehouse_name']);
      const filteredTransactionData = typeof transactionData === "string"? transactionData : await this.duplicateChecker.checkAndFilterDuplicates('transactions', transactionData, ['operation_id', 'userId',]);
      const filteredProductData = typeof productData === "string"? productData : await this.duplicateChecker.checkAndFilterDuplicates('products', productData, ['product_id', 'userId',]);

      const importAnalytics = typeof analyticsData === "string"? analyticsData : await this.importAnalytics(Number(headers.userId), analyticsData)
      const importStock = typeof stockData === "string"? stockData : await this.importStock(Number(headers.userId), stockData);
      const importTransaction = typeof transactionData === "string"? transactionData : await this.importTransaction(Number(headers.userId), transactionData);
      const importProduct = typeof productData === "string"? productData : await this.importProduct(Number(headers.userId), productData);

      if (importAnalytics === true && importStock === true && importTransaction === true && importProduct === true) {

        Logger.log("Data fetching and saving completed.");
        return true;
      } else {

        Logger.log(`Import status:`);
        Logger.log(`--> Analytics: ${typeof importAnalytics === "boolean"? importAnalytics : false}`);          // req      analytics
        Logger.log(`----> Errors: ${typeof importAnalytics === "string"?  importAnalytics : 'none'}`);          // errors   analytics

        Logger.log(`--> Stock_WareHouse: ${typeof importStock === "boolean"? importStock : false}`)             // req      stock
        Logger.log(`----> Errors: ${typeof importStock === "string"? importStock : 'none'}`);                   // errors   stock

        Logger.log(`--> Transactions: ${typeof importTransaction === "boolean"? importTransaction : false}`);   // req      transactions
        Logger.log(`----> Errors: ${typeof importTransaction === "string"? importTransaction : 'none'}`);       // errors   transactions
        
        Logger.log(`--> Products: ${typeof importProduct === "boolean"? importProduct : false}`);               // req      product
        Logger.log(`----> Errors: ${typeof importProduct === "string"? importProduct : 'none'}`);               // errors   product

        return false;
      }
      
    } catch(e) {

      Logger.log(e)
      return false;
    }
  }
}