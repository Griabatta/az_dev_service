// performance/performance.service.ts
import { Injectable, Logger, Res } from '@nestjs/common';
import { PerformanceRepository } from './repositories/performance.repository';
import { isAfter } from 'date-fns';
import axios from 'axios';
import { headerDTO } from '../Seller/models/seller.dto';
import { dateFormatFetch, MounthBack } from 'src/tools/data.dates';
import { JournalErrorsService } from '../Errors/errors.service';
import { PerformanceCampaingsRep } from './repositories/campaings.repostiroty';
import { CampaingCreateDto } from './models/createCampaing.dto';
import { DuplicateChecker } from 'src/utils/duplicateChecker';
import { Response } from 'express';
import { ReportService } from 'src/Report/report.service';
import { reportDto } from 'src/Report/models/report.dto';

@Injectable()
export class OzonPerformanceService {
  private readonly logger = new Logger(OzonPerformanceService.name);
  private readonly API_URL = 'https://api-performance.ozon.ru/api';

  constructor(
    private readonly performanceRepo: PerformanceRepository,

    private readonly errors: JournalErrorsService,

    private readonly campaingsRepo: PerformanceCampaingsRep,

    private readonly duplicate: DuplicateChecker,

    private readonly report: ReportService,
  ) {}

  async getAccessToken(params: headerDTO): Promise<string> {
    const {userId, clientPerForId, clientSecret} = params;
    const existingToken = await this.performanceRepo.findValidToken(Number(userId));
    const url = this.API_URL + "/client/token";
    if (existingToken && isAfter(existingToken.expiresAt, new Date())) {
      return existingToken.token;
    }
    
    const headers = {
      'Content-Type': "application/json",
      'Accept': 'application/json'
    }
    // Здесь нужно получить clientPerforId и clientSecret пользователя
    // Возможно, нужно добавить метод в репозиторий для получения этих данных
    const body = {
      client_id: clientPerForId, // Заменить на реальные данные
      client_secret: clientSecret, // Заменить на реальные данные
      grant_type: 'client_credentials',
    };

    try {

      const response = await axios.post(url, JSON.stringify(body), { headers: headers });

      const { access_token } = response.data;
      const token = await this.performanceRepo.findByUserId(Number(userId));
      if (token) {
        await this.performanceRepo.updateToken(access_token, Number(userId));
      } else {
        await this.performanceRepo.createToken({userId: Number(userId), expiresAt: new Date(new Date().getTime() + 30 * 60 * 1000), token: access_token});
      }
      

      return access_token;
    } catch (error) {

      // this.logger.error('Error getting Ozon token', error);
      console.log(error.message)
      throw new Error('Failed to get Ozon access token');
    }
  }

  async getAllCampaings(params: headerDTO, @Res() res: Response) {
    const userId = Number(params.userId);
    if (!userId) {
      return new Error("User Not found");
    };
      try {
        const trafaretsCampaings = await this.getCampaignForTrafarets(params);
        const serachCampaigns = await this.getCampaignForSearch(params);
        const bannerCampaigns = await this.getCampaignForBaner(params);
        if (!trafaretsCampaings || !serachCampaigns || !bannerCampaigns) {
          res.status(400).send("Error")
        }
        Logger.log("Import Success for campaings")
        res.send("Import Success");
      } catch (e) {
        return new Error(`Fetch failed: code: {${e.code || e.status}} message: {${e.message}}`)
      }
  }

  async getCampaignForTrafarets(params: headerDTO) { 
    try {
      
      if (!params.userId) {
        throw new Error("User not found");
      }
      const userId = Number(params.userId);
      const tokenTime = await this.performanceRepo.getTimeToken(userId);

      if (tokenTime?.expiresAt) {
        if (tokenTime?.expiresAt  < new Date()) {
          await this.getAccessToken(params);
        };
      } else {
        await this.getAccessToken(params)
      }
      const token = await this.performanceRepo.findByUserId(userId);

      const url = `${this.API_URL}/client/campaign?advObjectType=SKU`;
      const headers = {
        "Authorization": `Bearer ${token?.token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(url,{ headers });
      
      const formatingData = response.data.list.map((item:any) => {
        let data: CampaingCreateDto = {
          userId: userId,
          title: String(item.title),
          campaingId: String(item.id),
          cpmType: String(item.paymentType),
          advObjectType: String(item.advObjectType),
          fromDate: String(item.fromDate),
          toDate: String(item.toDate),
          dailyBudget: String(item.dailyBudget),
          budget: String(item.budget),
          status: String(item.state),
          createdAt: new Date().toISOString().slice(0,10)
        };
        return data;
      });
      const duplicatesResult = await this.duplicate.checkAndFilterDuplicates('campaing', formatingData, ['campaingId', 'createdAt']);
      if (Array.isArray(duplicatesResult)) {
        await this.campaingsRepo.createCapmaingsMany(duplicatesResult);
      } else {
        throw new Error('Expected duplicatesResult to be an array');
      }

      return formatingData;

    } catch (error) {
      console.error('Error getting campaign templates:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getCampaignForSearch(params: headerDTO) { 
    try {
      
      if (!params.userId) {
        throw new Error("User not found");
      }
      const userId = Number(params.userId);
      const tokenTime = await this.performanceRepo.getTimeToken(userId);

      if (tokenTime?.expiresAt) {
        if (tokenTime?.expiresAt  < new Date()) {
          await this.getAccessToken(params);
        };
      } else {
        await this.getAccessToken(params)
      }
      const token = await this.performanceRepo.findByUserId(userId);

      const url = `${this.API_URL}/client/campaign?advObjectType=SEARCH_PROMO`;
      const headers = {
        "Authorization": `Bearer ${token?.token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(url,{ headers });
      
      const formatingData = response.data.list.map((item:any) => {
        let data: CampaingCreateDto = {
          userId: userId,
          title: String(item.title),
          campaingId: String(item.id),
          cpmType: String(item.paymentType),
          advObjectType: String(item.advObjectType),
          fromDate: String(item.fromDate),
          toDate: String(item.toDate),
          dailyBudget: String(item.dailyBudget),
          budget: String(item.budget),
          status: String(item.state),
          createdAt: new Date().toISOString().slice(0,10)
        };
        return data;
      });
      const duplicatesResult = await this.duplicate.checkAndFilterDuplicates('campaing', formatingData, ['campaingId', 'createdAt']);
      if (Array.isArray(duplicatesResult)) {
        await this.campaingsRepo.createCapmaingsMany(duplicatesResult);
      } else {
        throw new Error('Expected duplicatesResult to be an array');
      }

      return formatingData;

    } catch (error) {
      console.error('Error getting campaign templates:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getCampaignForBaner(params: headerDTO) { 
    try {
      
      if (!params.userId) {
        throw new Error("User not found");
      }
      const userId = Number(params.userId);
      const tokenTime = await this.performanceRepo.getTimeToken(userId);

      if (tokenTime?.expiresAt) {
        if (tokenTime?.expiresAt  < new Date()) {
          await this.getAccessToken(params);
        };
      } else {
        await this.getAccessToken(params)
      }
      const token = await this.performanceRepo.findByUserId(userId);

      const url = `${this.API_URL}/client/campaign?advObjectType=BANNER`;
      const headers = {
        "Authorization": `Bearer ${token?.token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(url,{ headers });
      
      const formatingData = response.data.list.map((item:any) => {
        let data: CampaingCreateDto = {
          userId: userId,
          title: String(item.title),
          campaingId: String(item.id),
          cpmType: String(item.paymentType),
          advObjectType: String(item.advObjectType),
          fromDate: String(item.fromDate),
          toDate: String(item.toDate),
          dailyBudget: String(item.dailyBudget),
          budget: String(item.budget),
          status: String(item.state),
          createdAt: new Date().toISOString().slice(0,10)
        };
        return data;
      });
      const duplicatesResult = await this.duplicate.checkAndFilterDuplicates('campaing', formatingData, ['campaingId', 'createdAt']);
      if (Array.isArray(duplicatesResult)) {
        await this.campaingsRepo.createCapmaingsMany(duplicatesResult);
      } else {
        throw new Error('Expected duplicatesResult to be an array');
      }

      return formatingData;

    } catch (error) {
      console.error('Error getting campaign templates:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }


  async sendStatisticsInReport(userId: number) {

    const getCampaings = await this.performanceRepo.getCampaingsIds(userId);
    const token: string = await this.getAccessToken({userId: String(userId)})
    let campaigns: string[] = [];
    getCampaings.map(item => {
      campaigns.push(item.campaingId)
    });
    const url = "https://api-performance.ozon.ru:443/api/client/statistics/json"
    const date_from = MounthBack();
    const date_to = dateFormatFetch();
    const stepTimeOut = 70000;
    if (campaigns.length > 1) {
      for (let i = 0; i < campaigns.length; i+=10) {
        setTimeout(async () => {
          const body = {
            campaigns: ["14088834","8599658"],
            dateFrom: date_from,
            dateTo: date_to,
            groupBy: "NO_GROUP_BY"
          };
      
          const headers = {
            "Authorization": `Bearer ${token}`
          };
          try {
            const response = await axios.post(url, body, { headers });
            // console.log(response.data);
            const uuid = response.data.uuid;
            const data: reportDto = {
              userId: Number(userId),
              status: "In Progress",
              uuid: String(uuid),
              type: "StatisticPerformance"

            }
            const reportFind = await this.report.getReportByUUID(uuid);
            if (!reportFind) {
              await this.report.sendReport(data);
              Logger.log("Import Success for report")
            }            
          } catch(e) {
            console.log(e.message || e.error)
            this.errors.logError({
              userId: Number(userId),
              message: `Not found UUID, for ${campaigns[i]}`,
              serviceName: "PerformanceGetStatics",
              code: "404",
              priority: 3
            })
            Logger.log("Import failed")
            return false;
          }
        }, stepTimeOut)
      }
    }
  }
}

