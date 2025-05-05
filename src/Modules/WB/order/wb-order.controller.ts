import { Controller, Get, Logger, Next, Req, Res } from "@nestjs/common";
import { WbOrderService } from "./wb-order.service";
import { NextFunction, Request, Response } from "express";


@Controller('wbApi/order')
export class WbOrderContoller {

    private readonly logger = new Logger(WbOrderContoller.name)

    constructor(
        private readonly orderService: WbOrderService
    ) {

    }
    
    @Get('/')
    async UpdateForUser(@Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
        const tgId = req.headers.tgId;
        if (!tgId ) {
            res.status(401).send("Error: Unaunthorized");
            next();
        }
        try {
            if (typeof tgId === 'string') {
                await this.orderService.import(tgId); 
                res.status(200).json({ message: 'OK' }); 
            } else {
                res.status(400).json({ message: 'tgId must be a string' }); 
            }
        } catch (e) {
            this.logger.error(`Error: ${e.message}`);
            res.status(e.code || 500).json({ 
                message: e.message || 'Internal Server Error' 
            });
        }
    }
}