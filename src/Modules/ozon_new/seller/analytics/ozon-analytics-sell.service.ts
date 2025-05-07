import { Injectable } from "@nestjs/common";
import axios from "axios";
import { startOfDay, subDays } from "date-fns";
import { TypeRequestDataForOzonSellAnalytics } from "./ozon-analytics-sell.types";
import { metricGroups, metricTemplate } from "./ozon-analytics-sell.consts";
import { OzonAccountService } from "../../accountOzon/ozon-account.service";
import { OzonAnalyticsSellRepository } from "./ozon-analytics-sell.repository";


@Injectable()
export class OzonAnalyticsSellService {

    constructor(
        private readonly accountOzonService: OzonAccountService,
        private readonly ozonAnalyticsSellRepository: OzonAnalyticsSellRepository
    ) {}
    

    private async getOzonSellAnalytics (params: {
        accountData: { clientId: string, apiKey: string, accountId: number},
        requestData: TypeRequestDataForOzonSellAnalytics
    }) {
        const { clientId, apiKey } = params.accountData;
      
        if (!clientId || !apiKey) {
            return { message: 'Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key"', code: 401}
        }
    
        const url = 'https://api-seller.ozon.ru/v1/analytics/data';
        const { 
            dateFrom = params.requestData.dateFrom || new Date(new Date(subDays(new Date(), 7)).setHours(0,0,0,0)).toISOString().slice(0, 10),
            dateTo = params.requestData.dateTo || new Date().toISOString().slice(0, 10),
            dimension = params.requestData.dimension || ['sku', 'day'],
            filters = params.requestData.filters || [],
            sort = params.requestData.sort || [{}],
            limit = params.requestData.limit || 1000,
            offset = params.requestData.offset || 0
         } = params.requestData || {};    
        const defaultDimensions = ['sku', 'day'];
    
        const httpHeader = {
          'Client-Id': clientId,
          'Api-Key': apiKey,
          'Content-Type': 'application/json'
        };
        try {
    
    
          let responses: object[] = [];
          for (const metrics of metricGroups) {
            setTimeout(async () => {
              const body = {
                dateFrom,
                dateTo,
                dimension: dimension,
                filters: filters,
                sort: sort,
                limit: limit,
                offset: offset,
                metrics
              };
              const request:any = await axios.post(url, body, { headers: httpHeader });
              if (request.result.length > 0) {
                responses.push(request.result.data)
              }
            }, 2000)
             
          }

          const mergedData:any = responses.map((item:any, index) => {
                  const baseItem = {
                    dimensionsId: Number(item.dimensions[0]?.id || 0),
                    dimensionsName: item.dimensions[0]?.name || 0,
                    dimensionsDate: item.dimensions[1].id || "",
                    dimensionsIdCreatedAt: String(item.dimensionsId[0] + item.dimensions[1].id || startOfDay(new Date())),
                    accountId: params.accountData.accountId,
                    ...metricTemplate 
                  };
                  
                  responses.forEach((dataGroup, groupIndex) => {
                    const currentItem = dataGroup[index];
                    metricGroups[groupIndex].forEach((metric, metricIndex) => {
                      baseItem[metric] = currentItem.metrics[metricIndex];
                    });
                  });
                  
                  return baseItem;
                });
            
                
            return { data :mergedData, message: "OK", code: 200 };

    } catch(e) {
        return { data: [], message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
    }
    }

    public async import(tgId: string, params: any) {
        try {
            const account = await this.accountOzonService.getAccountByTgId(tgId)
            if (account?.ozon_Account) {
                const payload = {
                    accountData: { clientId: account?.ozon_Account.clientId, apiKey: account?.ozon_Account.apiKey, accountId: Number(account.ozon_Account.id)},
                    requestData: {
                        dateFrom : params?.dateFrom,
                        dateTo : params?.dateTo,
                        dimension : params?.dimension,
                        filters: params?.filters,
                        sort  : params?.sort,
                        limit : params?.limit,
                        offset : params?.offset,
                    }
                }
                const dataForRecordInDb = await this.getOzonSellAnalytics(payload);
                if (dataForRecordInDb?.code !== 200) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.ozonAnalyticsSellRepository.upserOzonSellAnalyticssManyRecord(dataForRecordInDb.data); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }  
    }

}