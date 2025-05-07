import { Injectable } from "@nestjs/common";
import { OzonAccountService } from "../../accountOzon/ozon-account.service";
import { OzonProductsSellRepository } from "./ozon-products-sell.repository";
import axios from "axios";
import { OzonProductsSellDTO } from "./ozon-products-sell.dto";
import { startOfDay } from "date-fns";


@Injectable()
export class OzonProductsSellService {

    constructor(
        private readonly accountOzonService: OzonAccountService,
        private readonly OzonProductSellRepository: OzonProductsSellRepository
    ) {}

    private async getOzonSellProducts(params: {
        accountData: {clientId: string, apiKey: string, accountId: number},
        requestData: any
    }) {
        const {clientId, apiKey} = params.accountData;
    
        if (!clientId || !apiKey) {
            return { data: [], message: 'Getting analytics ended with an error: "Unauthorized. No Client-Id or Api-key"', code: 401}
        };
        const url = 'https://api-seller.ozon.ru/v3/product/list';
        const {offer_id, product_id, visibility, last_id, limit} = params?.requestData?.body || {};

        const body = {
        "filter": {
            "offer_id": offer_id || [],
            "product_id": product_id || [],
            "visibility": visibility || "ALL"
        },
        "last_id": last_id || "",
        "limit": limit || 100
        };
        
        const httpHeader = {
        'Client-Id': clientId,
        'Api-Key': apiKey,
        'Content-Type': 'application/json'
        };

        try {

        const response = await axios.post(url, body, { headers: httpHeader });


        const last_id = response.data.result.last_id;
        let productData: OzonProductsSellDTO[] = response.data.result.items.map(item => ({
            ...item,
            product_id: String(item.product_id), // Преобразуем в строку
            offer_id: String(item.offer_id),
            offerIdCreatedAt: String(item.offer_id + startOfDay(new Date())),
            accountId: params.accountData.accountId
        }));

        if (last_id) { 
            const updatedBody = { ...body, last_id };
            const nextPageResponse = await axios.post(url, updatedBody, { headers: httpHeader });
            const nextPageItems = nextPageResponse.data.result.items.map(item => ({
            ...item,
            product_id: String(item.product_id),
            offer_id: String(item.offer_id),
            offerIdCreatedAt: String(item.offer_id + startOfDay(new Date())),
            accountId: params.accountData.accountId
            }));
            productData = [...productData, ...nextPageItems];
        }

        for (let item of productData) {
            const quants = item.quants;
            item.quants = JSON.stringify(quants);
        };


        return { data: productData, message: "OK", code: 200 }
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
                    requestData: params
                }
                const dataForRecordInDb = await this.getOzonSellProducts(payload);
                if (dataForRecordInDb?.code !== 200) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.OzonProductSellRepository.upserOzonSellProductsManyRecord(dataForRecordInDb.data); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }  
    }

}