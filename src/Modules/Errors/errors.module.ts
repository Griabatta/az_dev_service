import { Module } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { JournalErrorsController } from './errors.controller';
import { JournalErrorsRepository } from './repositories/error.repository';
import { JournalErrorsService } from './errors.service';

@Module({
  controllers: [JournalErrorsController],
  providers: [PrismaService, JournalErrorsRepository, JournalErrorsService],
  exports: [JournalErrorsService], // Для использования в других модулях
})
export class JournalErrorsModule {}