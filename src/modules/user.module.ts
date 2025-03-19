
import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/auth.controller';
import { PrismaService } from 'src/logic/prisma.service';
import { UserService } from 'src/logic/auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}