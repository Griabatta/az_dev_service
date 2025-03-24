import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleSheetsController } from 'src/Modules/exporter/exports.controller';
import { GoogleSheetsService } from 'src/Modules/exporter/exports.service';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [GoogleSheetsService, PrismaService],
  controllers: [GoogleSheetsController],
  exports: [GoogleSheetsService, PrismaService],
})
export class GoogleSheetsModule {}