// performance/performance.service.ts
import { Injectable, Logger, Res } from '@nestjs/common';
import axios from 'axios';
import { headerDTO } from '../Seller/models/seller.dto';
import { JournalErrorsService } from '../Errors/errors.service';
import { PerformanceCampaingsRep } from './repositories/campaings.repostiroty';
import { CampaingCreateDto } from './models/createCampaing.dto';
import { TokenRepo } from './utils/token/repository/token.repository';
import { startOfDay } from 'date-fns';
import { UserService } from '../Auth/auth.service';
import { decrypt } from 'src/tools/data.crypt';

@Injectable()
export class OzonPerformanceService {
  private readonly logger = new Logger(OzonPerformanceService.name);
  private readonly API_URL = 'https://api-performance.ozon.ru/api';

  constructor(

    private readonly campaingsRepo: PerformanceCampaingsRep,

    private readonly tokenRepo: TokenRepo

    // private readonly duplicate: DuplicateChecker,

  ) {}

  

  // async getAllCampaings(params: headerDTO) {
  //   const userId = Number(params.userId);
  //   if (!userId) {
  //     return new Error("User Not found");
  //   };
  //     try {
  //       var trafaretsCampaings: any;
  //       var serachCampaigns: any;
  //       var bannerCampaigns: any;

  //       setTimeout(async () => { trafaretsCampaings = await this.getCampaignForTrafarets(params);}, 1000)
  //       setTimeout(async () => {serachCampaigns = await this.getCampaignForSearch(params);}, 1000)
  //       setTimeout(async () => {bannerCampaigns = await this.getCampaignForBaner(params);}, 1000)
        
        
  //       if (!trafaretsCampaings || !serachCampaigns || !bannerCampaigns) {
  //        this.logger.error("NOT FOUND")
  //       }
  //       Logger.log("Import Success for campaings")
        
  //     } catch (e) {
  //       return new Error(`Fetch failed: code: {${e.code || e.status}} message: {${e.message}}`)
  //     }
  // }

  // async getCampaignForTrafarets(params: headerDTO) { 
  //   try {
      
  //     if (!params.id) {
  //       this.logger.error("User not found");
  //     }
  //     const userId = Number(params.id);

  //     const token = await this.tokenRepo.getTokenByUserId(userId);

  //     const url = `${this.API_URL}/client/campaign?advObjectType=SKU`;
  //     const headers = {
  //       "Authorization": `Bearer ${token?.token}`,
  //       "Content-Type": "application/json"
  //     };

  //     const response = await axios.get(url,{ headers });
      
  //     const formatingData = response.data.list.map((item:any) => {
  //       let data: CampaingCreateDto = {
  //         userId: userId,
  //         title: String(item.title),
  //         campaignId: String(item.id),
  //         cpmType: String(item.paymentType),
  //         advObjectType: String(item.advObjectType),
  //         fromDate: String(item.fromDate),
  //         toDate: String(item.toDate),
  //         dailyBudget: String(item.dailyBudget),
  //         budget: String(item.budget),
  //         status: String(item.state),
  //         createdAt: startOfDay(new Date())
  //       };
  //       return data;
  //     });
  //     const campaignsChek = await this.campaingsRepo.getCampaignsByUserId(userId);
  //     if (campaignsChek.length > 0) {
  //         await this.campaingsRepo.upsertmany(formatingData, userId);
  //     } else {
  //       await this.campaingsRepo.createCapmaingsMany(formatingData);
  //     };

  //     return formatingData;

  //   } catch (error) {
  //     console.error('Error getting campaign templates:', error.message);
  //     return {
  //       success: false,
  //       error: error.response?.data?.message || error.message,
  //     };
  //   }
  // }

  async getCampaignForType(params: headerDTO) { 
    try {
      
      if (!params.id) {
        this.logger.error("User not found");
      }
      const userId = Number(params.id);
      const token = await this.tokenRepo.getTokenByUserId(userId);
      if (token?.token === false) {
        this.logger.error("Token not found")
        return;
      }

      const url = `${this.API_URL}/client/campaign?advObjectType=${params.typeRequest}`;
      const headers = {
        "Authorization": `Bearer ${token?.token}`,
        "Content-Type": "application/json"
      };

      const response = await axios.get(url,{ headers });
      
      const formatingData = response.data.list.map((item:any) => {
        let data: CampaingCreateDto = {
          userId: userId,
          title: String(item.title),
          campaignId: String(item.id),
          cpmType: String(item.paymentType),
          advObjectType: String(item.advObjectType),
          fromDate: String(item.fromDate),
          toDate: String(item.toDate),
          dailyBudget: String(item.dailyBudget),
          budget: String(item.budget),
          status: String(item.state),
          createdAt: startOfDay(new Date())
        };
        return data;
      });
      const campaignsChek = await this.campaingsRepo.getCampaignsByUserId(userId);
      if (campaignsChek.length > 0) {
        await this.campaingsRepo.upsertmany(formatingData, userId);
      } else {
        await this.campaingsRepo.createCapmaingsMany(formatingData);
      };

      return formatingData;

    } catch (error) {
      console.error('Error getting campaign templates:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // async getCampaignForBaner(params: headerDTO) { 
  //   try {
      
  //     if (!params.id) {
  //       this.logger.error("User not found");
  //     }
  //     const userId = Number(params.id);
  //     const token = await this.tokenRepo.getTokenByUserId(userId);

  //     const url = `${this.API_URL}/client/campaign?advObjectType=BANNER`;
  //     const headers = {
  //       "Authorization": `Bearer ${token?.token}`,
  //       "Content-Type": "application/json"
  //     };

  //     const response = await axios.get(url,{ headers });
      
  //     const formatingData = response.data.list.map((item:any) => {
  //       let data: CampaingCreateDto = {
  //         userId: userId,
  //         title: String(item.title),
  //         campaignId: String(item.id),
  //         cpmType: String(item.paymentType),
  //         advObjectType: String(item.advObjectType),
  //         fromDate: String(item.fromDate),
  //         toDate: String(item.toDate),
  //         dailyBudget: String(item.dailyBudget),
  //         budget: String(item.budget),
  //         status: String(item.state),
  //         createdAt: startOfDay(new Date())
  //       };
  //       return data;
  //     });
  //     const campaignsChek = await this.campaingsRepo.getCampaignsByUserId(userId);
  //     if (campaignsChek.length > 0) {
  //       await this.campaingsRepo.upsertmany(formatingData, userId);
  //     } else {
  //       await this.campaingsRepo.createCapmaingsMany(formatingData);
  //     };

  //     return formatingData;

  //   } catch (error) {
  //     console.error('Error getting campaign templates:', error.message);
  //     return {
  //       success: false,
  //       error: error.response?.data?.message || error.message,
  //     };
  //   }
  // }


  // async getCampaigns() {
  //   const users = await this.user.getAllUsers();

  //     users?.map(async user => {
  //       const clientId = await decrypt(user.clientPerforId || "");
  //       const apikey = await decrypt(user.clientSecret || "");

  //       const headers: headerDTO = {
  //         clientPerForId: clientId,
  //         clientSecret: apikey,
  //         userId: String(user.id)
  //       };
  //       const result = await this.getAllCampaings(headers);
  //     })
  //     // res
    
  // }
}

