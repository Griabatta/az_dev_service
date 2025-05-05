import { Controller, Get, Logger, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { WbArticulesService } from "./wb-articules.service";


@Controller('/card')
export class WbArticulesController {
  private readonly logger = new Logger(WbArticulesController.name)

  constructor(
    private readonly articulesService: WbArticulesService
  ) {}
  
  @Get()
  async UpdateForUser(@Res() res: Response, @Req() req: Request, @Next() next: NextFunction) {
          const tgId = req.headers.tgId;
          if (!tgId ) {
              res.status(401).send("Error: Unaunthorized");
              next();
          }
          try {
              if (typeof tgId === 'string') {
                  await this.articulesService.import(tgId); 
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