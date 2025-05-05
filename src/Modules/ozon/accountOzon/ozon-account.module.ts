import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { TokenModule } from "../performance/utils/token/token.module";


@Module({
    imports: [
        PrismaModule,
        TokenModule
    ],
    exports: [],
    providers: [],
    controllers: []
})

export class OzonAccountModule {}