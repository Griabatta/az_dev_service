import { Injectable, Logger, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { Request, Response } from 'express';
import { PrismaService } from '../Prisma/prisma.service';
import { CreatePerformanceTokenDto } from './models/create-performance.dto';

interface PerformanceHeaders {
  clientId: string;
  clientSecret: string;
  userId: number;
}

interface TokenRequestBody {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

@Injectable()
export class OzonPerformanceService {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    
  }
  
    

  //_________________________________PERFORMANCE GET TOKEN_________________________________
  // ----------RESPONSE---------
  async getPerformanceToken(
    headers: PerformanceHeaders
  ): Promise<CreatePerformanceTokenDto[] | void> {
    const { userId, clientId, clientSecret } = headers;

    if (!clientId || !clientSecret) {
      await this.prisma.journalErrors.create({
        data: {
          errorUserId: (userId),
          errorMassage: `Unauthorized. No Client-Id or clientSecret.`,
          errorPriority: 3,
          errorCode: '401',
          errorServiceName: 'Performance/GetToken'
        }
      })
      throw new Error("Unauthorized"); 
    };

    const url = 'https://api-performance.ozon.ru/api/client/token';
    const body: TokenRequestBody = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    };

    const httpHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const data: CreatePerformanceTokenDto[] = await axios.post(url, body, { headers: httpHeaders });
      return data;
    } catch (error) {
      const errorCode = error.response?.status || 500; 
      const errorMessage = error.message || 'Unknown error';
    
      await this.prisma.journalErrors.create({
        data: {
          errorUserId: userId,
          errorMassage: `Request aborted, error: ${errorMessage}`,
          errorPriority: 3,
          errorCode: String(errorCode),
          errorServiceName: 'Performance/GetToken',
        },
      });
    
      throw new Error(errorMessage); 
    }
  }
  // ----------IMPORT---------
  async importPerformanceToken(userId: number, PerformanceTokenData: CreatePerformanceTokenDto[]) {
  
      if (PerformanceTokenData.length === 0) {
        await this.prisma.journalErrors.create({
          data: {
            errorUserId: userId,
            errorMassage: "No data",
            errorPriority: 2,
            errorCode: '404',
            errorServiceName: 'Performance/GetToken'
          }
        });
        throw new Error('No data');
      };
  
      const data = PerformanceTokenData.map(item => ({
        ...item,
        userId
      }));
  
      Logger.log("Start import..");
  
      try {
        await this.prisma.performanceToken.createMany(
          {
            data: data
          }
        );
        Logger.log("Import Success");
        Logger.log("-------------------------------")
      } catch (error) {
  
        if (error.status === 500) {
          await this.prisma.journalErrors.create({
            data: {
              errorUserId: userId,
              errorMassage: error.message,
              errorPriority: 3,
              errorCode: '500',
              errorServiceName: 'Performance/GetToken'
            }
          })
        }
        throw new Error(`Failed to import performanceToken data: ${error.message}`);
      }
    }
  
    // ----------RESPONSE&&IMPORT---------
    async fetchAndImportPerfToken(userId: number, headers: PerformanceHeaders, @Req() req: Request, @Res() res: Response) {
      Logger.log("Start get Perftoken..")
      const perfTokenData = await this.getPerformanceToken(headers);
      await this.importPerformanceToken(userId, perfTokenData || []);
      Logger.log("\n get Perftoken end.")
    }



}

