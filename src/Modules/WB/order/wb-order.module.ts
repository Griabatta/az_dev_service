import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { WbOrderRepository } from "./wb-order.repository";
import { WbOrderService } from "./wb-order.service";
import { WbOrderContoller } from "./wb-order.controller";
import { WbAccountModule } from "../accountWb/wb-account.module";


@Module({
    imports : [
        PrismaModule,
        WbAccountModule
    ],
    providers: [
        WbOrderRepository,
        WbOrderService
    ],
    controllers: [
        WbOrderContoller
    ],
    exports: [
        WbOrderService
    ]
})

export class WbOrderModule {}