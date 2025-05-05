import { Controller, Get, Logger, Next, Req, Res } from "@nestjs/common";
import { WbAnalyticService } from "./wb-analytic.service";
import { NextFunction, Request, Response } from "express";


@Controller('wbApi/analytic')
export class WbAnalyticContoller {

    private readonly logger = new Logger(WbAnalyticContoller.name)

    constructor(
        private readonly analyticService: WbAnalyticService
    ) {

    }
    
    @Get('/')
    async UpdateForUser(@Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
        const tgUser: string = req.get('tgId') || '';
        if (!tgUser) {
            res.status(401).send("Error: Unauthorized");
            next();
        }
        try {
            await this.analyticService.import(tgUser);
            res.status(200).send("message: 'OK'");
        } catch (e) {
            this.logger.error(`Error code: ${e.code || e.status}`);
            this.logger.error(e.message || e.text);
            res.status(e.code || e.status).send(e.message || e.text);
        } finally {
            next();
        }
    }
}