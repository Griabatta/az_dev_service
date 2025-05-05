import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { AccountWBRepository } from "./accountWB.repository";

@Injectable()
export class WbAccountServce {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly accountRepository: AccountWBRepository
    ) {

    }

    public async getAccountWBByTgId(tgId) {
        return await this.accountRepository.getAccountWBByTgId({ tgId })
    }

    public async getTokenByAccount(tg) {
        const user = await this.prismaService.users.findUnique({
            where: {
                tgId: tg
            }
        });
        if (!user) {
            return ''
        }
        const token = await this.prismaService.accountWb.findFirst({
            where: {
                userId: user.id
            }
        })
        if (!token?.token) {
            return ''
        } else {
            return token.token
        };
    };

    public async signIn(data: { tgId: string, token: string }) {
        
        if (!data.tgId && !data.token) {
            return { message: "Error. No Data", code: 401 };
        };

        const existingAccounts = await this.accountRepository.getAccountWBByTgId({tgId: data.tgId});

        if (existingAccounts?.wb_Account) {
            return { message: "Account is already existing", code: 401};
        };

        return await this.accountRepository.getUserByTgId({ tgId: data.tgId })
        .then(async id => {
            if (id?.id) {
                await this.accountRepository.createAccountWB({ userId: id.id, token: data.token});
                return { message: "Ok", code: 200 };
            }
        })
        .catch(e => {
            return { message: `Error. ${e.message || e.text }`, code: e.code || e.status || 500 };
        });
    }
}