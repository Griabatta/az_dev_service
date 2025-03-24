
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { MpstatsController } from './mpstat.controller';
import { OzonMpstatsService } from './ozon_mpstats.service';
@Module({
  controllers: [MpstatsController],
  providers: [OzonMpstatsService, PrismaService],
})
export class MPStatModule {}