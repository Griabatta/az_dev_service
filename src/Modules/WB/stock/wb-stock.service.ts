import { Injectable } from "@nestjs/common";
import { WbAccountServce } from "../accountWb/wb-account.service";
import { WbStockRepository } from "./wb-stock.repository";
import { startOfDay } from "date-fns";
import { CreateWBStockRecord } from "./wb-stock.dto";
import axios from "axios";


@Injectable()
export class WbStockService {
    
    constructor(
        private readonly accountWBService: WbAccountServce,
        private readonly wbStockRepository: WbStockRepository
    ) {
    }

    private async getStockByAPI(
        account: {token: string, id: number, userId: number | null },
        dateFrom = startOfDay(new Date()) // lastDateChange from next page request
        ): Promise<CreateWBStockRecord[] | any> { // get data for import
        const url = `https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=${dateFrom}`;
        const headers = {
            Authorization: account.token,
            "Content-Type": "application/json"
        };
        const result:CreateWBStockRecord[] = [];
        try {
            const response = await axios.get(url, { headers })
            response.data.map((r: any, index: number) => {
                const data: CreateWBStockRecord = {
                    warehouseName     : r.warehouseName,
                    supplierArticle   : r.supplierArticle,
                    nmId              : r.nmId,
                    barcode           : r.barcode,
                    quantity          : r.quantity,
                    inWayToClient     : r.inWayToClient,
                    inWayFromClient   : r.inWayFromClient,
                    quantityFull      : r.quantityFull,
                    category          : r.category,
                    subject           : r.subject,
                    brand             : r.brand,
                    techSize          : r.techSize,
                    Price             : r.Price,
                    Discount          : r.Discount,
                    isSupply          : r.isSupply,
                    isRealization     : r.isRealization,
                    SCCode            : r.SCCode,
                    nmIdCreatedAt     : String(r.nmId + startOfDay(new Date())),
                    accountId         : account.id
                }
                result.push(data);                
            })
            return { data: result, message: "OK", code: 200};
        } catch(e) {
            return { data : [], message: e.message || e.text, code: e.code || e.status || 500 }
        }
    }

    public async import(tgId: string) { // set data in database
        try {
            const account = await this.accountWBService.getAccountWBByTgId({ tgId })
            if (account?.wb_Account) {
                const dataForRecordInDb = await this.getStockByAPI(account.wb_Account);
                if (dataForRecordInDb?.code !== 200) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.wbStockRepository.upserStockManyRecord(dataForRecordInDb?.data); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch(e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 } //error, dufault 'Unexpected error', code 500
        };
    }
}