import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAccountModule } from "../../accountOzon/ozon-account.module";
import { OzonSkuSellController } from "./ozon-sku-sell.controller";
import { OzonSkuSellService } from "./ozon-sku-sell.service";
import { OzonSkuSellRepository } from "./ozon-sku-sell.repository";


@Module({
    imports: [
        PrismaModule,
        OzonAccountModule
    ],
    controllers: [
        OzonSkuSellController
    ],
    providers: [
        OzonSkuSellService,
        OzonSkuSellRepository
    ],
    exports: [
        OzonSkuSellService
    ]
})

export class OzonSkuSellModule {}