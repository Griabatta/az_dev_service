import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateWbArticulesRecord } from "./wb-articules.dto";


@Injectable()
export class WbArticulesRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {};

    async createArticulesManyRecords(data: CreateWbArticulesRecord[]) {
        return await this.prismaService.nmIdList.createMany({
            data,
            skipDuplicates: true
        });
    };

    async createArticulesRecord(data: CreateWbArticulesRecord) {
        return await this.prismaService.nmIdList.create({
            data
        });
    };

    async getAllArticules(accountId: number) {
        return await this.prismaService.nmIdList.findMany({
            where: {
                accountId: accountId
            },
            select: {
                id: true,
                nmid: true
            }
        });
    };

};