import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class OzonAccountRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    public async getAccountOZONByTgId(data: { tgId: string }) {
        return await this.prismaService.users.findFirst({
          where: {
            tgId: data.tgId
          },
          select: {
            ozon_Account: {
              select: {
                id: true,
                apiKey: true,
                clientSecret: true,
                clientId: true,
                clientPerforId: true,
                userId: true,
              }
            },
          }
        })
      }

    public async getPerTokenByTgId(tgId: string) {
        return await this.prismaService.users.findFirst({
            where: {
                tgId
            },
            select: {
                ozon_Account: {
                    select: {
                        performanceToken: {
                            select: {
                                token: true
                            }
                        }
                    }
                }
            }
        })
    }

}