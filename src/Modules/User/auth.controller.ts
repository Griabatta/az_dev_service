import { Controller, Next, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";



@Controller('/')
export class AuthController {
    
    constructor(
        private readonly signUpService: AuthService,
    ) {}

    @Post('signUp')
    async signUp(@Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
        const {tableSheetId, tgId} = req.body;
        if ( !tableSheetId || !tgId ) {
            res.send("Bad request").status(401);
        };
        try {
            const signUp = await this.signUpService.signUp({tableSheetId, tgId});
            res.send("OK").status(200);
            next();
        } catch (e) {
            res.send(e.message || e.text).status(e.code || e.status);
            next();
        };

    };


}