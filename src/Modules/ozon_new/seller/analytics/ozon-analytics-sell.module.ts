import { Module } from "@nestjs/common";
import { OzonAccountModule } from "src/Modules/ozon/accountOzon/ozon-account.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAnalyticsSellController } from "./ozon-analytics-sell.controller";
import { OzonAnalyticsSellService } from "./ozon-analytics-sell.service";
import { OzonAnalyticsSellRepository } from "./ozon-analytics-sell.repository";



@Module({
    imports: [
        PrismaModule,
        OzonAccountModule
    ],
    controllers: [
        OzonAnalyticsSellController
    ],
    providers: [
        OzonAnalyticsSellService,
        OzonAnalyticsSellRepository
    ],
    exports: [
        OzonAnalyticsSellService
    ]
})

export class OzonAnalyticsSellModule {}