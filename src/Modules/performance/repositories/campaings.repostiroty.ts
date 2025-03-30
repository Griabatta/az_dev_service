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

}