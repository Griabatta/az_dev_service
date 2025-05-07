import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { OzonSkuSellDTO } from "./ozon-sku-sell.dto";


@Injectable()
export class OzonSkuSellRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createdSKUs(data: OzonSkuSellDTO[]) {
        try {
            await this.prismaService.sKU_List.createMany({
                data,
                skipDuplicates: true
            });
            return { message: "OK", code: 200 };
        } catch (e) {
            return { message: e.message || e.text || "Unexpected error", code: e.code || e.status || 500 };
        }
    };

    async getSkusByAccountId(accountId: number) {
        return await this.prismaService.sKU_List.findMany({
            where: {
                accountId
            },
            select: {
                SKU: true
            }
        })
    }

}