import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { WbAccountModule } from "../accountWb/wb-account.module";
import { WbArticulesRepository } from "./wb-articules.repository";
import { WbArticulesService } from "./wb-articules.service";
import { WbArticulesController } from "./wb-articules.controller";


@Module({
  imports: [
    PrismaModule,
    WbAccountModule
  ],
  providers: [
    WbArticulesRepository,
    WbArticulesService
  ],
  controllers: [
    WbArticulesController
  ],
  exports: [
    WbArticulesService
  ]
})

export class WbArticulesModule {}