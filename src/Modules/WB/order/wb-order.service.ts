import { Injectable } from "@nestjs/common";
import { WbAccountServce } from "../accountWb/wb-account.service";
import axios from "axios";
import { startOfDay } from "date-fns";
import { WbOrderRepository } from "./wb-order.repository";
import { CreateWbOrderRecord } from "./wb-order.dto";


@Injectable()
export class WbOrderService {
    
    constructor(
        private readonly accountWBService: WbAccountServce,
        private readonly wbOrderRepository: WbOrderRepository
    ) {
    }

    private async getOrderByAPI(
        account: {token: string, id: number, userId: number | null },
        dateFrom = startOfDay(new Date()) // lastDateChange from next page request
        ): Promise<CreateWbOrderRecord[] | any> { // get data for import
        const url = `https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${dateFrom}`;
        const headers = {
            Authorization: account.token,
            "Content-Type": "application/json"
        };
        const result:CreateWbOrderRecord[] = [];
        try {
            const response = await axios.get(url, { headers })
            const dataForRecordInDb = response.data.map((r: any, index: number) => {
                const data = {
                    date            : r.date,
                    warehouseName   : r.warehouseName,
                    warehouseType   : r.warehouseType,
                    countryName     : r.countryName,
                    oblastOkrugName : r.oblastOkrugName,
                    regionName      : r.regionName,
                    supplierArticle : r.supplierArticle,
                    nmId            : r.nmId,
                    barcode         : r.barcode,
                    category        : r.category,
                    subject         : r.subject,
                    brand           : r.brand,
                    techSize        : r.techSize,
                    incomeID        : r.incomeID,
                    isSupply        : r.isSupply,
                    isRealization   : r.isRealization,
                    totalPrice      : r.totalPrice,
                    discountPercent : r.discountPercent,
                    spp             : r.spp,
                    finishedPrice   : r.finishedPrice,
                    priceWithDisc   : r.priceWithDisc,
                    isCancel        : r.isCancel,
                    cancelDate      : r.cancelDate,
                    orderType       : r.orderType,
                    sticker         : r.sticker,
                    gNumber         : r.gNumber,
                    srid            : r.srid,
                    nmIdCreatedAt   : String(r.nmId + startOfDay(new Date())),
                    accountId       : account.id
                }
                result.push(data);
            });
            
            return { data: result, message: "OK", code: 200};
        } catch (e) {
            return { data : [], message: e.message || e.text, code: e.code || e.status || 500 }
        }
    }

    public async import(tgId: string) { // set data in database
        try {
            const account = await this.accountWBService.getAccountWBByTgId({ tgId })
            if (account?.wb_Account) {
                const dataForRecordInDb = await this.getOrderByAPI(account.wb_Account);
                if (dataForRecordInDb?.message) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.wbOrderRepository.upserOrdersManyRecord(dataForRecordInDb); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 } 
        }        
    }
}