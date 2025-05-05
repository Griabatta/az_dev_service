import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { WbAccountModule } from "../accountWb/wb-account.module";
import { WbStockService } from "./wb-stock.service";
import { WbStockRepository } from "./wb-stock.repository";
import { WbStockContoller } from "./wb-stock.controller";


@Module({
    imports : [
        PrismaModule,
        WbAccountModule
    ],
    providers: [
        WbStockService,
        WbStockRepository
    ],
    controllers: [
        WbStockContoller
    ],
    exports: []
})

export class WbStockModule {}