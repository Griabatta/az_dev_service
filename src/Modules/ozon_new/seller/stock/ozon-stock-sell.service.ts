import { Injectable } from "@nestjs/common";
import { OzonStockSellRepository } from "./ozon-stock-sell.repository";
import { OzonAccountService } from "../../accountOzon/ozon-account.service";
import { OzonStockSellDTO } from "./ozon-stock-sell.dto";
import { format, startOfDay, subDays } from "date-fns";
import { OzonSkuSellRepository } from "../sku's/ozon-sku-sell.repository";
import axios from "axios";


@Injectable()
export class OzonStockSellService {

    constructor(
        private readonly accountOzonService: OzonAccountService,
        private readonly OzonStokSellRepository: OzonStockSellRepository,
        private readonly OzonSKUsSellRepository: OzonSkuSellRepository
    ) {}

    private async getOzonSellStock(params: {
        accountData: { clientId: string, apiKey: string, accountId: number },
        requestData: any
    }) {
        const { clientId, apiKey, accountId } = params.accountData;
  
        if (!clientId || !apiKey || !accountId) {
            return { data: [], message: 'Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key"', code: 401}
        };

        const url = 'https://api-seller.ozon.ru/v1/analytics/stocks';
        const { datefrom, dateto, cluster_ids, warehouse_ids, skus, turnover_grades, item_tags } = params?.requestData?.body || {};

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
            interface bodyForStockAnalytics {
                cluster_ids: string[],
                item_tags: string[],
                skus: string[],
                turnover_grades: string[],
                warehouse_ids: string[]
            }
            let sku: string[] = [''];
            
            if (!skus) {
                const skusByDb = await this.OzonSKUsSellRepository.getSkusByAccountId(Number(params.accountData.accountId));
                skusByDb.map(i => {
                    sku.push(i.SKU)
                })
            } else {
                sku.push(skus);
            };

            let responses: any[] = [];
            if (sku.length > 0) {
                for (let i = 0; i < sku.length; i += 99) {
                const skusForBody = sku.slice(i, 99).map((r:any) => {return r.SKU});
                
                const body: bodyForStockAnalytics = {
                    cluster_ids: cluster_ids || [],
                    item_tags: item_tags || [],
                    skus: skusForBody || [],
                    turnover_grades: turnover_grades || [],
                    warehouse_ids: warehouse_ids || []
                };
                
                const request:any = await axios.post(url, body, { headers: httpHeader })
                    
                    if (request.data.items.length > 0) {
                        responses.push(...request.data.items)
                    }
                };
            }
            
            let data: OzonStockSellDTO[] = [];
            
            if (responses.length > 0) {
                
                responses.map(res => {
                const resData = {
                    request_date                     : format(new Date(), 'yyyy-MM-dd'),
                    ads                              : String(res.ads) || '',
                    available_stock_count            : res.available_stock_count || 0,
                    cluster_id                       : res.cluster_id || 0,
                    cluster_name                     : String(res.cluster_name) || '',
                    days_without_sales               : res.days_without_sales || 0,
                    excess_stock_count               : res.excess_stock_count || 0,
                    expiring_stock_count             : res.expiring_stock_count || 0,
                    idc                              : String(res.idc) || '',
                    item_tags                        : String(res.item_tags) || '',
                    name                             : String(res.name) || '',
                    offer_id                         : String(res.offer_id) || '',
                    other_stock_count                : res.other_stock_count || 0,
                    requested_stock_count            : res.requested_stock_count || 0,
                    return_from_customer_stock_count : res.return_from_customer_stock_count || 0,
                    return_to_seller_stock_count     : res.return_to_seller_stock_count || 0,
                    sku                              : String(res.sku) || '',
                    stock_defect_stock_count         : res.stock_defect_stock_count || 0,
                    transit_defect_stock_count       : res.transit_defect_stock_count || 0,
                    transit_stock_count              : res.transit_stock_count || 0,
                    turnover_grade                   : String(res.turnover_grade) || '',
                    valid_stock_count                : res.valid_stock_count || 0,
                    waiting_docs_stock_count         : res.waiting_docs_stock_count || 0,
                    warehouse_id                     : String(res.warehouse_id) || '',
                    warehouse_name                   : String(res.warehouse_name) || '',
                    accountId                        : Number(params.accountData.accountId),
                    offerIdCreatedAt                 : String(res.offer_id + startOfDay(new Date()))
                };
                
                data.push(resData);
                });
            };      
            return { data: data, message: "OK", code: 200 };
        } catch (e) {
            return { data: [], message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }
    }

    public async import(tgId: string, params: any) {
        try {
            const account = await this.accountOzonService.getAccountByTgId(tgId)
            if (account?.ozon_Account) {
                const payload = {
                    accountData: { clientId: account?.ozon_Account.clientId, apiKey: account?.ozon_Account.apiKey, accountId: account?.ozon_Account.id},
                    requestData: params
                }
                const dataForRecordInDb = await this.getOzonSellStock(payload);
                if (dataForRecordInDb?.code !== 200) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.OzonStokSellRepository.upserOzonSellProductsManyRecord(dataForRecordInDb.data); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }  
    }
}