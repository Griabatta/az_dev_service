import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/Prisma/prisma.service";
import { WbAccountServce } from "../accountWb/wb-account.service";
import { WbArticulesService } from "../articules/wb-articules.service";
import { startOfDay, subDays } from "date-fns";

interface nmIDs {
    data: [
        {
            nmid: string,
            id: number
        }
    ],
    message: string,
    code: number
}


@Injectable()
export class WbAnalyticService {
    
    private readonly API_URL = "https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail/history";

    constructor(
        private readonly accountService: WbAccountServce,
        private readonly articulesService: WbArticulesService
    ) {

    }

    private async getByApi(token: string, nmIDs: nmIDs) { // get data for import
        const headers = {
            Authorization: token
        }

        const nmidBatch: string[] = [];
        
        if (nmIDs.code === 200) {
            nmIDs.data.map(i => {
                nmidBatch.push(i.nmid);
            });
        };

        const body = {
            "nmIDs": nmidBatch,
            "period": {
                "begin": startOfDay(subDays(new Date(), 6)),
                "end": startOfDay(new Date())
            },
            "timezone": "Europe/Moscow",
            "aggregationLevel": "day"
          }
        const response = axios.get(this.API_URL, { headers });

    }

    public async import(tgUser: string) { // set data in database
        const token = await this.accountService.getTokenByAccount(tgUser);
        const nmIDs: nmIDs = await this.articulesService.exportDataFromDB(tgUser); 
        function r() {
            // create task, max nmids lenght  20.
        }
        const data = await this.getByApi(token, nmIDs);
    }
}