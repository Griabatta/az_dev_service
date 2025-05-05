import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { encrypt } from "src/tools/data.crypt";
import { createOzonAccDTO } from "./ozon-account.dto";
import { TokenService } from "../performance/utils/token/token.service";


@Injectable()
export class OzonAccountService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly tokenPerfromanceService: TokenService

    ) {

    }

    private async createAccount(tgId: string, clientId: string, apiKey: string, performanceId: string = '', clientSecret: string = '') {
        const userFindByTgId = await this.prismaService.users.findFirst({
            where: { tgId }
        });

        
        const paramsForCreatingAccount: createOzonAccDTO = {
            userId: userFindByTgId?.id,
            clientId: clientId,
            apiKey: apiKey,
            clientPerForId: await encrypt(performanceId),
            clientSecret: await encrypt(clientSecret),
            performanceTokenId: 0
        };

        const isExistAccount = await this.prismaService.accountOzon.findFirst({
            where: {
                clientId
            }
        });

        if (isExistAccount) {
            return { message: "Account already exists", code: 400 };
        };

        const accountCreated = await this.prismaService.accountOzon.create({
            data: paramsForCreatingAccount
        })

        // await this.prismaService.
        const dataForToken = {accountId: accountCreated.id, token: accountCreated.}
        // userId, clientPerForId, clientSecret
    
        if (accountCreated) {
            await this.tokenPerfromanceService.createToken(dataForToken)
        }

    }

    public createOzonAccount() {

    }
}