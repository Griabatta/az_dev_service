
import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/Modules/Prisma/prisma.service';
import { UserController } from './auth.controller';
import { UserService } from './auth.service';
import { UserRep } from './repository/user.repository';
import { TokenModule } from '../performance/utils/token/token.module';
import { PrismaModule } from '../Prisma/prisma.module';
import { TaskModule } from '../Tasks/tasks.module';

@Module({
  imports: [
    forwardRef(() => TokenModule),
    forwardRef(() => TaskModule),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRep],
  exports: [UserService, UserRep]
})
export class UserModule {}