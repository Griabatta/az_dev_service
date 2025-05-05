import { Injectable } from "@nestjs/common";
import { PerformanceTokenDto } from "../models/token.dto";
import { PrismaService } from "src/Prisma/prisma.service";
import { startOfDay } from "date-fns";


@Injectable()
export class TokenRepo {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  
  async createToken(tokenData: PerformanceTokenDto): Promise<PerformanceTokenDto> {
    return this.prisma.performanceToken.create({
      data: tokenData,
    });
  };

  async updateToken(token: string, accountId: number) {
    return this.prisma.performanceToken.update({
      where: {accountId},
      data: {
        token: token,
        updatedAt: startOfDay(new Date())
      }
    })
  };

  async getTokenByUserId(accountId: number) {
   try {
    return this.prisma.performanceToken.findUnique({
      where: {
        accountId
      },
      select: {
        token: true
      }
    })
   } catch(e) {
    return {token: false};
   }
  }

}


