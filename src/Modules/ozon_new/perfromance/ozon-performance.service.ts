import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { performanceRepository } from "./repository/performance.repository";
import axios from "axios";
import { startOfDay } from "date-fns";
import { CampaingCreateDto } from "./ozon-performance.dto";


@Injectable()
export class OzonPerformanceService {
    
    constructor(
        private readonly performanceRepository: performanceRepository
    ) {}

    private areCampaignsEqual(campaignsToday: any[], campaignsByRequest: any[]) {
        const campaignsTodayMap = new Map<string, typeof campaignsToday[0]>();
        for (const camp of campaignsToday) {
            campaignsTodayMap.set(camp.campaignId, camp);
        };

        function areCampaignsEqual(campA: any, campB: any): boolean {
            const keysToIgnore = new Set(["id", "accountId", "createdAt"]);
            const keysA = Object.keys(campA).filter(key => !keysToIgnore.has(key));
        
            for (const key of keysA) {
                if (campA[key] !== campB[key]) return false;
            }
            return true;
        };

        for (const newCamp of campaignsByRequest) {
            const existingCamp = campaignsTodayMap.get(newCamp.campaignId);
        
            if (!existingCamp) {
                this.performanceRepository.createCampaigns(newCamp);
            } else if (!areCampaignsEqual(existingCamp, newCamp)) {
                this.performanceRepository.updateTodayCampaigns(newCamp, existingCamp.id);
            };
        };
    };

    public async getAndImportCampaigns(tgId: string, typeRequest: string) {
        try {
            
            if (!tgId) {
                return { message: "Account not found.", code: 404 };
            };
            const token =  await this.performanceRepository.getAccountByTgId(tgId)
            .then(async (acc: any) => {
                let obj: {token: string, accId: number} = {token: '', accId: 0};
                obj.token = await this.performanceRepository.getTokenByAccount(acc.id)[0].token;
                obj.accId = acc.id;
                return obj;
            })
            .catch(e => {
                return { token: false, accId: 0 };
            });

            if (token.token === false || token.accId === 0) {
                return { message: "Error, token not found or unexpected error"};
            };
    
            const url = `https://api-performance.ozon.ru/api/client/campaign?advObjectType=${typeRequest}`;
            const headers = {
                "Authorization": `Bearer ${token?.token}`,
                "Content-Type": "application/json"
            };
    
            const response = await axios.get(url,{ headers });
            
            const campaignsByRequest = response.data.list.map((item:any) => {
                let data: CampaingCreateDto = {
                    accountId: token.accId,
                    title: String(item.title),
                    campaignId: String(item.id),
                    cpmType: String(item.paymentType),
                    advObjectType: String(item.advObjectType),
                    fromDate: String(item.fromDate),
                    toDate: String(item.toDate),
                    dailyBudget: String(item.dailyBudget),
                    budget: String(item.budget),
                    status: String(item.state),
                    campaignIdCreatedAt: String(item.id + startOfDay(new Date()))
                };
                return data;
            });
            const campaignsToday = await this.performanceRepository.getTodayCampaignsByid(token.accId);
            try {
                this.areCampaignsEqual(campaignsToday, campaignsByRequest);
    
                return { message: "OK", code: 200 }
            } catch(e) {
                return { message: `Unexpected Error, ${e. message || e.text}`, code: e.code || e.status || 500 }
            }
    
        } catch (error) {
            console.error('Error getting campaign templates:', error.message);
            return {
            success: false,
            error: error.response?.data?.message || error.message,
            };
        }
    }

    

}