import { Injectable } from "@nestjs/common";
import { WbAccountServce } from "../accountWb/wb-account.service";
import { WbArticulesRepository } from "./wb-articules.repository";
import axios from "axios";
import { CreateWbArticulesRecord, exportDataArt } from "./wb-articules.dto";
import { startOfDay } from "date-fns";

interface Cursor {
    nmID: string;
    updatedAt: string;
    total: number;
}

interface errorRequest {
    message: string,
    code: number
}

interface ApiResponse {
    result: CreateWbArticulesRecord[];
    cursor: Cursor,
    status: errorRequest
}

@Injectable()
export class WbArticulesService {

  constructor(
    private readonly accountWBService: WbAccountServce,
    private readonly wbArticulesRepository: WbArticulesRepository
  ) {}

  

    private async requestForArticules(url, body, headers, accountId): Promise<ApiResponse | any> {
        const result:CreateWbArticulesRecord[] = [];
        try {
            const response = await axios.post(url, body, { headers });
            const dataForRecordInDb = response.data.cards.map((r: any, index: number) => {
                const data = {
                    nmid       : r.nmID,
                    imtID      : r.imtID,
                    nmUUID     : r.nmUUID,
                    subjectID  : r.subjectID,
                    subjectName: r.subjectName,
                    vendorCode : r.vendorCode,
                    title      : r.title,
                    brand      : r.brand,
                    photos     : r.photos?.[0]?.big ?? Object.values(r.photos[0] ?? {})[0] ?? 'null',
                    accountId: accountId
                }
                return data;
            })
            result.push(...dataForRecordInDb);
            return {
                result,
                cursor: { nmID: response.data.cursor.nmID, updatedAt: response.data.cursor.updatedAt, total: response.data.cursor.total },
                status: { message: "OK", code: 200 }
            };
        } catch (e) {
            return {
                result: [],
                cursor: {},
                status: {message: e.message || e.text, code: e.code || e.status || 500} 
            }
        }
    }

    private async getArticulesByAPI(
        account: {token: string, id: number, userId: number | null }, 
        updatedAt: string = '', nmID: string = ''): Promise<CreateWbArticulesRecord[] | any> {
            
		const url = `https://content-api.wildberries.ru/content/v2/get/cards/list`;
        const headers = {
        Authorization: account.token,
            "Content-Type": "application/json"
        };
        let allResults: CreateWbArticulesRecord[] = [];
        let cursor: { nmID: string; updatedAt: string } = { nmID: '', updatedAt: '' };
        const limit: number = 100;
        const body = {
            "settings": {                      
                "cursor": {
                    "limit": limit,
                    "updatedAt": cursor.updatedAt,
                    "nmID": cursor.nmID
                },
                "filter": {
                    "withPhoto": -1
                }
            }
        };

        let dataByRquest: ApiResponse; 

        do {
            dataByRquest = await this.requestForArticules(
                url,
                { 
                    ...body,
                    settings: {
                        ...body.settings,
                        cursor: {
                            ...body.settings.cursor,
                            nmID: cursor.nmID,
                            updatedAt: cursor.updatedAt
                        }
                    }
                },
                headers,
                account.id
            );
            if (dataByRquest.status.code !== 200) {
                continue;
            };
            allResults.push(...dataByRquest.result);

            cursor = {
                nmID: dataByRquest.cursor.nmID,
                updatedAt: dataByRquest.cursor.updatedAt
            };

        } while (dataByRquest.cursor.total >= limit);

        return allResults;
  	}

  	public async import(tgId: string) { // set data in database
        try {
            const account = await this.accountWBService.getAccountWBByTgId({ tgId })
            if (account?.wb_Account) {
				const dataForRecordInDb = await this.getArticulesByAPI(account.wb_Account);
				if (dataForRecordInDb?.message) { // if error
					return { message: dataForRecordInDb.message, code: dataForRecordInDb.code } 
				}
				await this.wbArticulesRepository.createArticulesManyRecords(dataForRecordInDb); // import in database
				return { message: "Ok", code: 200 } // return result injection in database
			}
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }		
	}

    public async exportDataFromDB(tgId: string): Promise<exportDataArt | any> {
        try {
            const account = await this.accountWBService.getAccountWBByTgId({ tgId })
            if (account?.wb_Account) {
				const dataForRecordInDb = await this.wbArticulesRepository.getAllArticules(account.wb_Account.id);
				return { data: dataForRecordInDb, message: "Ok", code: 200 } // return result injection in database
			}
        } catch (e) {
            return { data: [], message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 }
        }
    }
}