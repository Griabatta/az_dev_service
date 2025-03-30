// google-sheets.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { PrismaService } from '../Prisma/prisma.service';
import { AnalyticsRepository } from '../Seller/repositories/analytics.repository';
import { StockRepository } from '../Seller/repositories/stock-warehouse.repository';
import { TransactionRepository } from '../Seller/repositories/transaction.repository';
import { ProductRepository } from '../Seller/repositories/productList.repository';
import { keysForAnalytics, keysForProductList, keysForStock, keysForTransactions } from './models/export.models';

@Injectable()
export class GoogleSheetsService {
  private readonly sheets = google.sheets('v4');
  private readonly auth: any;
  
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly repAnalyt: AnalyticsRepository,
    private readonly repStock: StockRepository,
    private readonly repTrans: TransactionRepository,
    private readonly repProduct: ProductRepository
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
  async getDatabyDB(userId: number) {
    
    const userWithAllData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        analytics: true,
        stock_warehouse: true,
        transactions: true,
        product: true,
        performanceToken: true
      }
    });
  
    if (!userWithAllData) {
      throw new NotFoundException('User not found');
    }
  
    const exportData = {
      userInfo: {
        id: userWithAllData.id,
        email: userWithAllData.email,
        name: userWithAllData.name,
        tableSheetId: userWithAllData.tableSheetId
      },
      analytics: userWithAllData.analytics,
      stock: userWithAllData.stock_warehouse,
      transactions: userWithAllData.transactions,
      products: userWithAllData.product,
      performanceTokens: userWithAllData.performanceToken
    };
    
    return exportData;
  }
 
  async ensureSheetExists(sheetName: string, hidden = false) {
    return this.createSheetIfNotExists(sheetName, hidden);
  };

  async appendData(sheetName: string, values: any[][], startCell = 'A1') {
    await this.ensureSheetExists(sheetName);
    const range = `${sheetName}!${startCell}`;
    
    const spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
    const authClient = await this.auth.getClient();

    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
      auth: authClient,
    };

    const response = await this.sheets.spreadsheets.values.append(request);
    return response.data;
  }


  private async createSheetIfNotExists(sheetName: string, hidden = false) {
    const spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
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

  async sheetExists(sheetName: string): Promise<boolean> {
    const spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
    const authClient = await this.auth.getClient();
  
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId,
      auth: authClient,
    });
  
    return spreadsheet.data.sheets?.some(
      sheet => sheet.properties?.title === sheetName
    ) ?? false;
  }

  async overwriteSheet(sheetName: string, values: any[][]) {
    await this.ensureSheetExists(sheetName);
    const range = `${sheetName}!A1`;

    
    const spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
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

        default:
          throw new Error("Invalid request type");
      }
    } catch(e) {
      throw new Error(`Failed to formating data: ${e.message || e}`);
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
        default:
          throw new Error("Invalid request type");
      }
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  };
  
};

