import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { CampaignItemDTO, CreateReportDTO, ParsedCampaignItem } from "../models/report.dto";
import { lightFormat } from "date-fns";


@Injectable()
export class ReportRepo {
    constructor(
        private readonly prisma: PrismaService
    ) {};

    async getAllReports() {
        return this.prisma.reports.findMany();
    };

    async createReport(data: CreateReportDTO): Promise<CreateReportDTO> {
        return this.prisma.reports.create({
            data
        })
    }

    async updateReport(id: number, status: string) {
        return this.prisma.reports.update({
            where: {id},
            data: {
                status: status
            }
        })
    }

    async getReportByUserId(userId: number) {
        return this.prisma.reports.findMany({
            where: { userId }
        })
    }

    async createCampaignItem(data: CampaignItemDTO[]) {
        return this.prisma.campaignItem.createMany({
            data: data
        });
    }

    // async upsertCampaignItems(items: ParsedCampaignItem[]) {
    //     return Promise.all(
    //       items.map(item =>
    //         this.prisma.campaignItem.upsert({
    //           where: {
    //             campaignId_userId_createdAt: {
    //               campaignId: item.campaignId,
    //               userId: item.userId,
    //               createdAtDB: item.createdAt
    //             }
    //           },
    //           update: item,
    //           create: item
    //         })
    //       )
    //     );
    //   }
}