
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { UserController } from './auth.controller';
import { UserService } from './auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}