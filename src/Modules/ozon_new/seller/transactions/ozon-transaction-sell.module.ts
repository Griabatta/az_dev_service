import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAccountModule } from "../../accountOzon/ozon-account.module";
import { OzonTransactionsSellController } from "./ozon-transaction-sell.controller";
import { OzonTransactionsSellService } from "./ozon-transaction-sell.service";
import { OzonTransactionsSellRepository } from "./ozon-transaction-sell.repository";

@Module({
    imports: [
        PrismaModule,
        OzonAccountModule
    ],
    controllers: [
        OzonTransactionsSellController
    ],
    providers: [
        OzonTransactionsSellService,
        OzonTransactionsSellRepository
    ],
    exports: [
        OzonTransactionsSellService
    ]
})

export class OzonTransactionsSellModule {} 