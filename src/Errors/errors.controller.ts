import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { JournalErrorsService } from './errors.service';

@Controller('errors')
export class JournalErrorsController {
  constructor(private readonly errorsService: JournalErrorsService) {}

  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.errorsService.getUserErrors(Number(userId));
  }

  @Get('critical')
  async getCritical() {
    return this.errorsService.getCriticalErrors();
  }

  @Post('log')
  async logCustomError(
    @Body() body: {
      userId: number;
      message: string;
      priority: number;
      code?: string;
      serviceName: string;
    },
  ) {
    return this.errorsService.logError(body);
  }
}