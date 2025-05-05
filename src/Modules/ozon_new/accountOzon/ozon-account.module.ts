import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonAccountService } from "./ozon-account.service";
import { CreatePerformanceTokenService } from "./ozon-per-token.service";
import { OzonAccountController } from "./ozon-account.controller";


@Module({
    imports: [
        PrismaModule,
        
    ],
    providers: [ OzonAccountService, CreatePerformanceTokenService ],
    controllers: [ OzonAccountController ],
    exports: []
})

export class OzonAccountModule {}