import { Injectable } from "@nestjs/common";
import { startOfDay } from "date-fns";
import { PrismaService } from "src/Prisma/prisma.service";
import { CampaingCreateDto } from "../ozon-performance.dto";


@Injectable()
export class performanceRepository {

  constructor(
    private readonly prismaService: PrismaService
  ) {};

  async getAccountByTgId(tgId: string) {
    return await this.prismaService.accountOzon.findFirst({
      where: {
        user: {
          tgId
        }
      },
      select: {
        id: true,
        clientId: true,
        apiKey: true,
        clientPerforId: true,
        clientSecret: true
      }
    })
  }

  async getAccountByUserId(userId: number) {
    return await this.prismaService.accountOzon.findFirst({
      where: { userId },
      select: {
        clientId: true,
        clientPerforId: true,
        clientSecret: true,
        apiKey: true
      }
    });
  };

  async getAcccounts() {
    return await this.prismaService.accountOzon.findMany({
      select: {
        clientId: true,
        clientPerforId: true,
        clientSecret: true,
        apiKey: true
      }
    });
  };

  async getTokenByAccount(accountId: number) {
    return await this.prismaService.performanceToken.findUnique({
      where: {
        accountId
      },
      select: {
        token: true
      }
    });
  };

  async getTodayCampaignsByid(accountId: number, createdAt: Date = startOfDay(new Date)) {
    return await this.prismaService.campaignTemplate.findMany({
      where: {
        createdAt: createdAt,
      },
      select: {
        id: true,
        accountId: true,
        title: true,
        campaignId: true,
        cpmType: true,
        advObjectType: true,
        fromDate: true,
        toDate: true,
        dailyBudget: true,
        budget: true,
        status: true,
        createdAt: true,
        
      }
    });
  };

  async updateTodayCampaigns(data: CampaingCreateDto, id: number) {
    return await this.prismaService.campaignTemplate.update({
      where: {
        id: id,
        accountId: data.accountId
      },
      data: {
        id: id,
        ...data
      }
    });
  };

  async createCampaigns(data: CampaingCreateDto) {
    return await this.prismaService.campaignTemplate.create({data});
  };

  async createManyCampaigns(data: CampaingCreateDto[]) {
    return await this.prismaService.campaignTemplate.createMany({data});
  };

};