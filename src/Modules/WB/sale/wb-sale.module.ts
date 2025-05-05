import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { WbAccountModule } from "../accountWb/wb-account.module";
import { WbSaleService } from "./wb-sale.service";
import { WbSaleRepository } from "./wb-sale.repository";
import { WbSaleContoller } from "./wb-sale.controller";


@Module({
    imports : [
        PrismaModule,
        WbAccountModule
    ],
    providers: [
        WbSaleService,
        WbSaleRepository
    ],
    controllers: [
        WbSaleContoller
    ],
    exports: [ 
        WbSaleService
    ]
})

export class WbSaleModule {}