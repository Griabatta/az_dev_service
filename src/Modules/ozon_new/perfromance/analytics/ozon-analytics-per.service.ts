import { Injectable } from "@nestjs/common";
import { OzonAccountService } from "../../accountOzon/ozon-account.service";
import { OzonAnalyticsRepository } from "./ozon-analytics-per.repository";
import axios from "axios";
import { CreateOzonAnalyticsRecord } from "./ozon-analytics-per.dto";
import { startOfDay } from "date-fns";


@Injectable()
export class OzonAnalyticsService {

	constructor(
		private readonly ozonAccount: OzonAccountService,
		private readonly OzonAnalyticsRepository: OzonAnalyticsRepository
	) {}
	
	private async getStatisticDailyPerformance(token: string): Promise<{
        
        data: CreateOzonAnalyticsRecord[];
        message: string;
        code: number;
    }> {
        const url = "https://api-performance.ozon.ru:443/api/client/statistics/daily";
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    
        try {
            const response = await axios.get(url, { headers });
            const result: CreateOzonAnalyticsRecord[] = response.data?.rows?.map((res: any) => ({
                campaignIdCreatedAt: String(res.id + startOfDay(new Date())),
                campaignId: res.id,
                title: res.title,
                date: res.date,
                views: res.views,
                clicks: res.clicks,
                moneySpent: res.moneySpent,
                avgBid: res.avgBid,
                orders: res.orders,
                ordersMoney: res.ordersMoney,
            })) || [];
    
            return {
                data: result,
                message: "OK",
                code: 200
            };
        } catch (e) {
            return {
                data: [],
                message: e.message || e.text || "Unknown error",
                code: e.code || e.status || 500
            };
        }
    }

	public async import(tgId: string) {
        try {
            const account = await this.ozonAccount.getTokenByTgId(tgId);
            if (account?.ozon_Account?.performanceToken?.token) {
                const dataForRecordInDb = await this.getStatisticDailyPerformance(account.ozon_Account.performanceToken?.token);
                if (dataForRecordInDb?.message) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                // const resultInjection = await this.wbOrderRepository.upserOrdersManyRecord(dataForRecordInDb); // import in database
                // return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }
	}
}