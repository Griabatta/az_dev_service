import { Controller, Next, Post, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WbAccountServce } from "./wb-account.service";


@Controller('/wbApi/account')
export class WbAccoutnCrontoller {
    constructor(
        private readonly wbAccService: WbAccountServce
    ) {

    }

    @Post('/updateToken')
    async UpdateToken(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

    }

    @Post('/signIn')
    async signInAccount(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const { tgId, token } = req.body;
        if (!tgId || !token) {
            res.send("Bad request.").status(401);
        };

        await this.wbAccService.signIn({ tgId, token })
        .then(r => {
            res.send(r?.message).status(r?.code);
        })
        .catch(e => {
            res.send(e.message).status(e.code);
        });
        
    }
}