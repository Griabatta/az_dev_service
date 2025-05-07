import { Controller, Logger } from "@nestjs/common";
import { OzonSkuSellService } from "./ozon-sku-sell.service";


@Controller('/ozonApi/skus')
export class OzonSkuSellController {

    private readonly looger = new Logger(OzonSkuSellController.name)

    constructor(
        private readonly ozonSkuSellService: OzonSkuSellService
    ) {}

}