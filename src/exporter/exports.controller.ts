import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { GoogleSheetsService } from 'src/exporter/exports.service';
import { JournalErrorsService } from '../Errors/errors.service';
import { SheetName } from './models/export.models';
import { UserService } from '../Modules/Auth/auth.service';

@Controller('/api/export')
export class GoogleSheetsController {
  constructor(
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly errors: JournalErrorsService,
    private readonly user: UserService
  ) {}

  // @Post('/to-sheet')
    

//   @Post('from-sheet')
//   async importFromSheet(@Body() body: { range: string }) {
//     return this.googleSheetsService.getData(body.range);
//   }

  
}