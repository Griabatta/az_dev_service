

import { Module } from "@nestjs/common";
import { WbAccountModule } from "../accountWb/wb-account.module";


@Module({
    imports : [
        WbAccountModule,
        WbAccountModule
    ],
    providers: [],
    exports: []
})

export class WbAnalyticsModule {}