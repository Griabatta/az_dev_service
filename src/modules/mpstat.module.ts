
import { Module } from '@nestjs/common';
import { MpstatsController } from 'src/controllers/mpstat.controller';
import { OzonMpstatsService } from 'src/logic/ozon_mpstats.service';
import { PrismaService } from 'src/logic/prisma.service';
@Module({
  controllers: [MpstatsController],
  providers: [OzonMpstatsService, PrismaService],
})
export class MPStatModule {}