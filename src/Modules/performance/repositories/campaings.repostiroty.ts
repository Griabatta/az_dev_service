import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { CreateCampaignDto } from "../models/campaint.dto";
import { Prisma } from "@prisma/client";



@Injectable()
export class PerformanceCampaingsRep {
    constructor(
        private readonly prisma: PrismaService
    ) {};

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

    async upsertCampaing(campaignId: string, data: Prisma.CampaignTemplateUncheckedCreateInput ) {
        return this.prisma.campaignTemplate.upsert({
            where: {
                campaignId: campaignId
            },
            create: data, 
            update: data
        });
    }

    
}