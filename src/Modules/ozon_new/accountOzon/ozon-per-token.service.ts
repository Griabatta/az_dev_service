import { Injectable, Logger } from "@nestjs/common";
import { createPerfromanceTokenDTO, updateTokenForAccountDTO } from "./ozon-account.dto";
import axios from "axios";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class CreatePerformanceTokenService {

    private readonly logger = new Logger(CreatePerformanceTokenService.name)

    constructor(
        private readonly prismaService: PrismaService
    ) {}
    
    async createToken(data: createPerfromanceTokenDTO, type: string) {
        const url = "https://api-performance.ozon.ru:443/api/client/token";

        const headers = {
            'Content-Type': "application/json",
            'Accept': 'application/json'
        }
        
        const body = {
            client_id: data.clientPerForId,
            client_secret: data.clientSecret, 
            grant_type: 'client_credentials',
        };
    
        try {
    
        const response = await axios.post(url, body, { headers: headers });
    
        const { access_token } = response.data;

        switch (type) {
            case "Create": {
                const result = await this.prismaService.performanceToken.create({
                    data: {
                        token: access_token,
                        accountId: data.accountId
                    }
                })
                .then(r => { return r })
                .catch(e => { return e });
                return result;
            };

            case "Update" : {
                const result = await this.prismaService.performanceToken.update({
                    where: {
                        accountId: data.accountId
                    },
                    data: {
                        token: access_token,
                    }
                })
                .then(r => { return r })
                .catch(e => { return e });

                return result;
            };

            default : {
                return "Not type"
            };
        }

        } catch (e) {
            return { message: e.message || e.text, code: 500}
        };
    };

    async updateTokenAlluser() {
        const accounts = await this.prismaService.accountOzon.findMany();
        if (!accounts) {
            return;
        }
        accounts.map((acc: any) => {
            this.createToken({accountId: acc.id, clientPerForId: acc.clientPerforId, clientSecret: acc.clientSecret}, "Update")
            .then(r => r)
            .catch (e => {
                this.prismaService.journalErrors.create({
                    data: {
                        errorUserId: acc.id,
                        errorMassage: e.message || e.text,
                        errorPriority: 3,
                        errorCode: "500",
                        errorServiceName: CreatePerformanceTokenService.name
                    }
                });
            })
        });
        return { message: "OK", code: 200 };
    };

    async getAccountWBByTgId() {
        
    }

}