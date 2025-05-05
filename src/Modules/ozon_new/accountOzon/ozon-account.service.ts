import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { createOzonAccDTO, updateTokenForAccountDTO } from "./ozon-account.dto";
import { CreatePerformanceTokenService } from "./ozon-per-token.service";
import { OzonAccountRepository } from "./ozo-account.repository";


@Injectable()
export class OzonAccountService {
    
    constructor (
        private readonly prismaService: PrismaService,
        private readonly tokenService: CreatePerformanceTokenService,
        private readonly ozonAccountRepository: OzonAccountRepository
    ) {}

    async createAccount(data: createOzonAccDTO) {
        try {
            const accountCreated = await this.prismaService.accountOzon.create({
                data
            }).then(async r => {
                const token = await this.tokenService.createToken({accountId: r.id, clientSecret: data.clientSecret, clientPerForId: data.clientPerforId }, "Create")
                .then(async t => {
                    await this.updateTokenForAccount({id: t.id, performanceTokenId: Number(t.token)})
                    .then(r => { return r })
                    .catch(e => { return e })
                })
                
            })
            .catch(e => { return e });

            return { message: "OK", code: 200};
        } catch (e) {
            return { message: e.message || e.text, code: e.code || e.status || 500 }
        }
    }

    async updateAccount(data: createOzonAccDTO, id: number, createAt: string) {
        try {
            await this.prismaService.accountOzon.update({
                where: {
                    id: id
                },
                data: {
                    clientId: data.clientId,
                    clientSecret: data.clientSecret,
                    clientPerforId: data.clientPerforId,
                    apiKey: data.apiKey
                }
            });
            return { message: "OK", code: 200};
        } catch (e) {
            return { message: e.message || e.text, code: e.code || e.status || 500 }
        }
    };

    async updateTokenForAccount(data: updateTokenForAccountDTO) {
        try {
            await this.prismaService.accountOzon.update({
                where: {
                    id: data.id
                },
                data: {
                    performanceTokenId: data.performanceTokenId
                }
            });
            return { message: "OK", code: 200};
        } catch (e) {
            return { message: e.message || e.text, code: e.code || e.status || 500 }
        }
    };

    public getAccountByTgId(tgId: string) {
        return this.ozonAccountRepository.getAccountOZONByTgId({ tgId });
    }

    getTokenByTgId(tgId: string) {
        return this.ozonAccountRepository.getPerTokenByTgId(tgId);
    }
}