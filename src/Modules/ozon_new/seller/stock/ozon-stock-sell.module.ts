import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAccountModule } from "../../accountOzon/ozon-account.module";
import { OzonStockSellController } from "./ozon-stock-sell.controller";
import { OzonStockSellService } from "./ozon-stock-sell.service";
import { OzonStockSellRepository } from "./ozon-stock-sell.repository";
import { OzonSkuSellModule } from "../sku's/ozon-sku-sell.module";


@Module({
    imports: [
        PrismaModule,
        OzonAccountModule,
        OzonSkuSellModule
    ],
    controllers: [
        OzonStockSellController
    ],
    providers:[
        OzonStockSellService,
        OzonStockSellRepository
    ],
    exports: [
        OzonStockSellService
    ]
})

export class OzonStockSellModule {}