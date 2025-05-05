import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { WbAccountServce } from "./wb-account.service";
import { AccountWBRepository } from "./accountWB.repository";
import { WbAccoutnCrontoller } from "./wb-account.controller";


@Module({
    imports : [ PrismaModule ],
    providers: [
        WbAccountServce,
        AccountWBRepository
    ],
    controllers: [
        WbAccoutnCrontoller
    ],
    exports: [
        WbAccountServce
    ]
})

export class WbAccountModule {}