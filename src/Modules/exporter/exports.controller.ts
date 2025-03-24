import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleSheetsService } from 'src/Modules/exporter/exports.service';

@Controller('/api/export')
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Post('/to-sheet')
    async exportData(@Body() body: { 
      sheetName: string; 
      data: any[][];
      hidden?: boolean;
    }) {
      // Создаем лист (если нужно) и экспортируем данные
      await this.googleSheetsService.ensureSheetExists(body.sheetName, body.hidden ?? false);
      return this.googleSheetsService.appendData(body.sheetName, body.data);
    }

  @Post('overwrite-sheet')
  async overwriteSheet(@Body() body: { sheetName: string; userId: number}, @Res() res: Response) {
    const data = await this.googleSheetsService.getDatabyDB(body.userId || 1);
    res.json(data);
    // return this.googleSheetsService.overwriteSheet(body.sheetName, data);
  }
//   @Post('from-sheet')
//   async importFromSheet(@Body() body: { range: string }) {
//     return this.googleSheetsService.getData(body.range);
//   }

  
}