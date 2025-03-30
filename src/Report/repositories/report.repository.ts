import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Modules/Prisma/prisma.service";
import { reportDto } from "../models/report.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportRepository {
    constructor(
        private readonly prisma: PrismaService
    ) {};

    async createReport(data: reportDto) {
        return await this.prisma.reports.create({
            data
        });
    };

    async deleteReportById(id) {
        return await this.prisma.reports.delete({
            where: {id}
        });
    };

    async getAllReports() {
        return await this.prisma.reports.findMany();
    };

    async getReportByUserId(userId: number) {
        return await this.prisma.reports.findMany({
            where: {userId: userId}
        });
    };

    async cascadeDeleteReportByUser(userId: number) {
        return await this.prisma.reports.deleteMany({
            where: {userId}
        });
    };

    async updateReport(id: number, data: reportDto) {
        return await this.prisma.reports.update({
            where: {id},
            data: data
        })
    }

    async getReportByUUID(uuid:string) {
        return await this.prisma.reports.findUnique({
            where: {uuid}
        })
    }


}