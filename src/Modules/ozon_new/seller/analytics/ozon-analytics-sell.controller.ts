import { Controller, Get, Logger, Next, Post, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OzonAnalyticsSellService } from "./ozon-analytics-sell.service";


@Controller('/ozonApi/analytics')
export class OzonAnalyticsSellController {

    private readonly logger = new Logger(OzonAnalyticsSellController.name)

    constructor(
        private readonly analyticsService: OzonAnalyticsSellService
    ) {}

    @Post()
    async create() {}

    @Get('/')
    async UpdateForUser(@Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
        const tgId = req.headers.tgId;
        if (!tgId ) {
            res.status(401).send("Error: Unaunthorized");
            next();
        }
        try {
            if (typeof tgId === 'string') {
                await this.analyticsService.import(tgId, req.body); 
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