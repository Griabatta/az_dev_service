// google-sheets.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { PrismaService } from '../Prisma/prisma.service';
import { AnalyticsRepository } from '../Seller/repositories/analytics.repository';
import { StockRepository } from '../Seller/repositories/stock-warehouse.repository';
import { TransactionRepository } from '../Seller/repositories/transaction.repository';
import { ProductRepository } from '../Seller/repositories/productList.repository';
import { keysForAnalytics, keysForPerFormance, keysForProductList, keysForStock, keysForTransactions, SheetName } from './models/export.models';
import { PerformanceRepository } from '../performance/repositories/performance.repository';
import { JournalErrorsService } from '../Errors/errors.service';
import { UserService } from '../Auth/auth.service';

@Injectable()
export class GoogleSheetsService {
  private readonly sheets = google.sheets('v4');
  private readonly auth: any;
  private readonly logger = new Logger(GoogleSheetsService.name)
  
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly repAnalyt: AnalyticsRepository,
    private readonly repStock: StockRepository,
    private readonly repTrans: TransactionRepository,
    private readonly repProduct: ProductRepository,
    private readonly performanceRepo: PerformanceRepository,
    private readonly error: JournalErrorsService,
    private readonly user: UserService
  ) {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.configService.get('GOOGLE_SHEETS_CLIENT_EMAIL'),
        private_key: this.configService.get('GOOGLE_SHEETS_PRIVATE_KEY').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  // GET ALL DATA for seller
  // async getDatabyDB(userId: number) {
    
  //   const userWithAllData = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: {
  //       analytics: true,
  //       stock_warehouse: true,
  //       transactions: true,
  //       product: true,
  //       performanceToken: true
  //     }
  //   });
  
  //   if (!userWithAllData) {
  //     this.logger.error('User not found');
  //   }
  
  //   const exportData = {
  //     userInfo: {
  //       id: userWithAllData?.id,
  //       email: userWithAllData?.email,
  //       name: userWithAllData?.name,
  //       tableSheetId: userWithAllData?.tableSheetId
  //     },
  //     analytics: userWithAllData?.analytics,
  //     stock: userWithAllData?.stock_warehouse,
  //     transactions: userWithAllData?.transactions,
  //     products: userWithAllData?.product,
  //     performanceTokens: userWithAllData?.performanceToken
  //   };
    
  //   return exportData;
  // }
 
  async ensureSheetExists(sheetName: string, hidden = false, tableId: string) {
    return this.createSheetIfNotExists(sheetName, hidden, tableId);
  };

  // async appendData(sheetName: string, values: any[][], startCell = 'A1', tableId: string) {
  //   await this.ensureSheetExists(sheetName);
  //   const range = `${sheetName}!${startCell}`;
    
  //   const spreadsheetId = tableId;
  //   const authClient = await this.auth.getClient();

  //   const request = {
  //     spreadsheetId,
  //     range,
  //     valueInputOption: 'USER_ENTERED',
  //     insertDataOption: 'INSERT_ROWS',
  //     resource: { values },
  //     auth: authClient,
  //   };

  //   const response = await this.sheets.spreadsheets.values.append(request);
  //   return response.data;
  // }


  private async createSheetIfNotExists(sheetName: string, hidden = false, tableId: string) {
    const spreadsheetId = tableId;
    const authClient = await this.auth.getClient();

    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId,
      auth: authClient,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === sheetName
    );

    if (!sheetExists) {
      const request: sheets_v4.Params$Resource$Spreadsheets$Batchupdate = {
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName,
                hidden,
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 26,
                },
              },
            },
          }],
        },
        auth: authClient,
      };

      await this.sheets.spreadsheets.batchUpdate(request);
    }
  }

  // async sheetExists(sheetName: string): Promise<boolean> {
  //   const spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
  //   const authClient = await this.auth.getClient();
  
  //   const spreadsheet = await this.sheets.spreadsheets.get({
  //     spreadsheetId,
  //     auth: authClient,
  //   });
  
  //   return spreadsheet.data.sheets?.some(
  //     sheet => sheet.properties?.title === sheetName
  //   ) ?? false;
  // }

  async overwriteSheet(sheetName: string, values: any[][], tableId: string) {
    await this.ensureSheetExists(sheetName, false, tableId);
    const range = `${sheetName}!A1`;
    
    const spreadsheetId = tableId;
    const authClient = await this.auth.getClient();
  
    // Сначала очищаем лист
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A:Z`, // Очищаем все колонки от A до Z
      auth: authClient,
    });
  
    // Затем записываем новые данные
    const response = await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
      auth: authClient,
    });
  
    return response.data;
  }

  async setValidFormForSheet(data: object[], typeRequest: string) {
    let headers: string[];
    let rows: any;
    let resultForSheet: any[][];
    try {
      switch (typeRequest) {
        
        case "Analytics":
          headers = keysForAnalytics;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;

        case "Stock_Ware":
          headers = keysForStock;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;

        case "Transactions":
          headers = keysForTransactions;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;

        case "ProductList":
          headers = keysForProductList;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;

        case "Trafarets": {
          headers = keysForPerFormance;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;
        }
        case "Search": {
          headers = keysForPerFormance;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;
        }
        case "Banner": {
          headers = keysForPerFormance;
          rows = data.map(obj => {
            return Object.values(obj);
          })
          resultForSheet = [headers, ...rows];
          return resultForSheet;
        }
        default:
          this.logger.error("Invalid request type");
      }
    } catch(e) {
      this.logger.error(`Failed to formating data: ${e.message || e}`);
    }
    
  }

  async getDataForExportByNameRequest(typeRequest: string, userId: number) {
    let result: object[] = [];
    try {
      
      switch (typeRequest) {
        case "Analytics":
          result.push(...await this.repAnalyt.findByUserId(userId) || []);
          return result
        case "Stock_Ware":
          result.push(...await this.repStock.findByUserId(userId) || []);
          return result
        case "Transactions":
          result.push(...await this.repTrans.findByUserId(userId) || []);
          return result
        case "ProductList":
          result.push(...await this.repProduct.findByUserId(userId) || []);
          return result
        case "Trafarets":
          result.push(...await this.performanceRepo.getDataForExportTrafarets(userId) || [])
          return result;
        case "Search":
          result.push(...await this.performanceRepo.getDataForExportSearch(userId) || [])
          return result;
        case "Banner":
        result.push(...await this.performanceRepo.getDataForExportBanner(userId) || [])
        return result;
        default:
          this.logger.error("Invalid request type");
      }
    } catch (error) {
      this.logger.error(`Failed to fetch data: ${error.message}`);
    }
  };
  
  // async exportData(params: { 
  //   sheetName: string; 
  //   data: any[][];
  //   hidden?: boolean;
  // }, tableId: string) {

  //   await this.ensureSheetExists(params.sheetName, params.hidden ?? false);
  //   return this.appendData(params.sheetName, params.data, undefined, tableId);
  // }

  async ExportInSheet(type: string) {
    
    
    const users = await this.user.getAllUsers();
    if (!users) {
      Logger.log("Users not found")
    };
    
    try {
      const promiseUser = users.map(async user => {
        const data = await this.getDataForExportByNameRequest(type, user.id);

        if (data?.length == 0) {
          await this.error.logError({
            userId: user.id,
            message: "Bad request. No data.",
            serviceName: type,
            code: "400",
            priority: 2
          })
          return;
          
        }

        const validForm = await this.setValidFormForSheet(data || [], String(type));
        
        await this.overwriteSheet(SheetName(type), validForm || [], user.tableSheetId);
        
      })
      Promise.all(promiseUser)
      .then(r => {
        this.logger.debug(`Sheets ${type} exported`)
      })

    } 
    catch (e) {
      // await this.error.logError({
      //   userId: user.id,
      //   message: "Failed to export data to table.",
      //   serviceName: type,
      //   code: "500",
      //   priority: 2
      // })
      this.logger.error(`Sheets ${type} export failed`)
    }
      
      
  }
};

