import { Injectable } from "@nestjs/common";
import { PerformanceTokenDto } from "../models/token.dto";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
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

  async updateToken(token: string, userId: number) {
    return this.prisma.performanceToken.update({
      where: {userId},
      data: {
        token: token,
        updatedAt: startOfDay(new Date())
      }
    })
  };

  async getTokenByUserId(userId: number) {
   try {
    return this.prisma.performanceToken.findFirst({
      where: {
        userId
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


