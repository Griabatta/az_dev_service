import { forwardRef, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { TokenRepo } from "./repository/token.repository";
import { JournalErrorsModule } from "src/Errors/errors.module";
import { PrismaModule } from "src/Prisma/prisma.module";
import { UserModule } from "src/Modules/Auth/user.module";

@Module({
  imports: [
    HttpModule,
    JournalErrorsModule,
    PrismaModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TokenController],
  providers: [TokenService, TokenRepo],
  exports: [TokenService, TokenRepo]
})
export class TokenModule {}