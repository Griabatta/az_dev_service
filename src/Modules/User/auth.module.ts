import { Module } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        PrismaService
    ],
    providers: [ AuthService ],
    controllers: [ AuthController ],
    exports: []
})

export class AuthModule {}