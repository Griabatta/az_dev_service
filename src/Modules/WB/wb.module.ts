import { Module } from "@nestjs/common";
import { WbAnalyticsModule } from "./analytic/wb-analytic.module";
import { WbOrderModule } from "./order/wb-order.module";
import { WbSaleModule } from "./sale/wb-sale.module";
import { WbStockModule } from "./stock/wb-stock.module";
import { WbAccountModule } from "./accountWb/wb-account.module";


@Module({
    imports : [
        WbAnalyticsModule,
        WbOrderModule,
        WbSaleModule,
        WbStockModule,
        WbAccountModule
    ],
    providers: [],
    exports: []
})

export class WBModule {}