// performance/performance.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';

@Controller('/performance')
export class PerformanceController {

  @Post()
  async fetchUserData() {
    // return await this.prisma.user.findMany();
  }

  
  
}