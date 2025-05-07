import { Injectable } from "@nestjs/common";
import { OzonAccountService } from "../../accountOzon/ozon-account.service";
import { OzonSkuSellRepository } from "./ozon-sku-sell.repository";
import { OzonSkuSellDTO } from "./ozon-sku-sell.dto";
import axios from "axios";


@Injectable()
export class OzonSkuSellService {

    constructor(
        private readonly accountOzonService: OzonAccountService,
        private readonly OzonSkuSellRepository: OzonSkuSellRepository
    ) {}

    private async getOzonSellSku( params: {
        accountData: { clientId: string, apiKey: string, accountId: number },
        requestData: any
    }) {
        const { clientId, apiKey, accountId } = params.accountData;
        if (!clientId || !apiKey || !accountId) {
            return { data: [], message: 'Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key"', code: 401}
        };

        const url = 'https://api-seller.ozon.ru/v4/product/info/attributes';
        const { product_id, offer_id, sku, visibility, limit, sort_dir, last_id } = params?.requestData?.body || {};

        const body = {
            "filter": {
                "product_id": product_id || [],
                "offer_id": offer_id || [],
                "sku": sku || [],
                "visibility": visibility || "ALL"
            },
            "limit": limit || 1000,
            "sort_dir": sort_dir || "ASC",
            "last_id": last_id || ""
        }

        const header = {
            'Client-Id': clientId,
            'Api-Key': apiKey,
            'Content-Type': 'application/json'
        }

        try {
            let response = await axios.post(url, body, { headers: header});

            if (response.data.last_id) {
                const newBody = {...body};
                newBody.last_id = response.data.last_id;
                const resByLastId = await axios.post(url, newBody, { headers: header })
                if (!resByLastId.data.code && resByLastId.data.result) {
                    response.data.result = {...resByLastId.data.result}
                }
                
            }
            if (!response.data.result) {
                return { data: [], message: "No data, SKU_Service", code: 204}
            };
        
            const data: OzonSkuSellDTO[] = response.data.result.map(res => {
                return {
                accountId: accountId,
                SKU: String(res.sku)
                }
            })
            return { data: data, message: "OK", code: 200};
        } catch (e) {
            return { data: [], message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }
    };

    public async import(tgId: string, params: any) {
        try {
            const account = await this.accountOzonService.getAccountByTgId(tgId)
            if (account?.ozon_Account) {
                const payload = {
                    accountData: { clientId: account?.ozon_Account.clientId, apiKey: account?.ozon_Account.apiKey, accountId: Number(account.ozon_Account.id)},
                    requestData: params
                }
                const dataForRecordInDb = await this.getOzonSellSku(payload);
                if (dataForRecordInDb?.code !== 200) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.OzonSkuSellRepository.createdSKUs(dataForRecordInDb.data); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }  
    }

}