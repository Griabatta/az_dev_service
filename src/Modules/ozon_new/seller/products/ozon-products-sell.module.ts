import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAccountModule } from "../../accountOzon/ozon-account.module";
import { OzonProductsSellController } from "./ozon-products-sell.controller";
import { OzonProductsSellService } from "./ozon-products-sell.service";
import { OzonProductsSellRepository } from "./ozon-products-sell.repository";


@Module({
    imports: [
        PrismaModule,
        OzonAccountModule
    ],
    controllers: [
        OzonProductsSellController
    ],
    providers: [
        OzonProductsSellService,
        OzonProductsSellRepository,
    ],
    exports: [
        OzonProductsSellService
    ]
})

export class OzonProductsSellModule {}