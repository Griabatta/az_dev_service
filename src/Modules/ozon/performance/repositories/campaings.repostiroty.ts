import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateCampaignDto } from "../models/campaint.dto";
import { Prisma } from "@prisma/client";
import { isValid, startOfDay } from "date-fns";



@Injectable()
export class PerformanceCampaingsRep {
    constructor(
        private readonly prisma: PrismaService
    ) {};
    
    async upsertmany(data: any[], userId: number) {
        // Campaignt_campId_userId_date
        return await this.prisma.$transaction(
            data.map(item => {
              
              const rawDate = item.date ? new Date(item.date) : new Date();
              
              if (!isValid(rawDate)) {
                throw new Error(`Invalid date format: ${item.date}`);
              }
              
              const dateAtStartOfDay = startOfDay(rawDate);
        
              return this.prisma.campaignTemplate.upsert({
                where: {
                  Campaignt_campId_userId_date: {
                    userId,
                    campaignId: item.campaignId,
                    createdAt: dateAtStartOfDay
                  }
                },
                create: {
                    userId: userId,
                    createdAt: dateAtStartOfDay,
                    ...item
                },
                update: {
                    userId: userId,
                  createAt: item.createAt,
                  ...item
                }
              });
            })
          );
    }


    async createCapmaingsMany(data: Prisma.CampaignTemplateCreateManyInput[]) {
        return this.prisma.campaignTemplate.createMany({
            data
        })
    };

    async getCampaignsByUserId(userId: number) {
        return this.prisma.campaignTemplate.findMany({
            where: {
                userId
            }
        })
    };

    async getCamaignsByUserIdForBundle(userId: number) {
        return this.prisma.campaignTemplate.findMany({
            where: {userId},
            select: {
                campaignId: true,
                advObjectType: true
            }
        })
    }

    async getAllCampaigns() {
        return this.prisma.campaignTemplate.findMany();
    }

    // async upsertCampaing(campaignId: string, data: Prisma.CampaignTemplateUncheckedCreateInput ) {
    //     return this.prisma.campaignTemplate.upsert({
    //         where: {
    //             campaignId: campaignId
    //         },
    //         create: data, 
    //         update: data
    //     });
    // }

    
}