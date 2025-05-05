import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class AccountWBRepository {

  constructor (
    private readonly prismaService: PrismaService
  ) {

  }

  async createAccountWB(data: { userId: number, token: string }) {
    return await this.prismaService.accountWb.create({
      data
    });
  };

  async updateAccountWB(data: { userId: number, token: string}) {
    return await this.prismaService.accountWb.update({
      where: {
        userId: data.userId
      },
      data: {
        token: data.token
      }
    });
  };

  async deleteAccountWB(data: { userId: number }) {
    return await this.prismaService.accountWb.delete({
      where: {
        userId: data.userId
      }
    });
  };

  async getUserByTgId(data: { tgId: string }) {
    return await this.prismaService.users.findUnique({
      where: {
        tgId: data.tgId
      },
      select: {
        id: true
      }
    })
  }

  async getAccountWBByTgId(data: { tgId: string }) {
    return await this.prismaService.users.findFirst({
      where: {
        tgId: data.tgId
      },
      select: {
        wb_Account: {
          select: {
            id: true,
            token: true,
            userId: true,
          }
        },
      }
    })
  }

}