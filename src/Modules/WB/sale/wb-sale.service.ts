import { Injectable } from "@nestjs/common";
import { startOfDay } from "date-fns";
import { CreateWBSaleRecord } from "./wb-sale.dto";
import axios from "axios";
import { WbAccountServce } from "../accountWb/wb-account.service";
import { WbSaleRepository } from "./wb-sale.repository";


@Injectable()
export class WbSaleService {
    
    constructor(
        private readonly accountWBService: WbAccountServce,
        private readonly wbSaleRepository: WbSaleRepository
    ) {
    }

    private async getSaleByAPI(
        account: {token: string, id: number, userId: number | null },
        dateFrom = startOfDay(new Date()) // lastDateChange from next page request
        ): Promise<CreateWBSaleRecord[] | any> { // get data for import
        const url = `https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${dateFrom}`;
        const headers = {
            Authorization: account.token,
            "Content-Type": "application/json"
        };
        const result:CreateWBSaleRecord[] = [];
        try {
            const response = await axios.get(url, { headers });
            response.data.map((r: any, index: number) => {
                const data: CreateWBSaleRecord = {
                    date              : r.date,
                    warehouseName     : r.warehouseName,
                    warehouseType     : r.warehouseType,
                    countryName       : r.countryName,
                    oblastOkrugName   : r.oblastOkrugNam,
                    regionName        : r.regionName,
                    supplierArticle   : r.supplierArticl,
                    nmId              : r.nmId,
                    barcode           : r.barcode,
                    category          : r.category,
                    subject           : r.subject,
                    brand             : r.brand,
                    techSize          : r.techSize,
                    incomeID          : r.incomeID,
                    isSupply          : r.isSupply,
                    isRealization     : r.isRealization,
                    totalPrice        : r.totalPrice,
                    discountPercent   : r.discountPercent,
                    spp               : r.spp,
                    paymentSaleAmount : r.paymentSaleAmount,
                    forPay            : r.forPay,
                    finishedPrice     : r.finishedPrice,
                    priceWithDisc     : r.priceWithDisc,
                    saleID            : r.saleID,
                    orderType         : r.orderType,
                    sticker           : r.sticker,
                    gNumber           : r.gNumber,
                    srid              : r.srid,
                    nmIdCreatedAt     : String(r.nmId + startOfDay(new Date())),
                    accountId         : account.id
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
                const dataForRecordInDb = await this.getSaleByAPI(account.wb_Account);
                if (dataForRecordInDb?.message) { // if error
                    return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
                }
                const resultInjection = await this.wbSaleRepository.upserSalesManyRecord(dataForRecordInDb); // import in database
                return { message: resultInjection.message, code: resultInjection.code } // return result injection in database
            }
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }        
    }
}