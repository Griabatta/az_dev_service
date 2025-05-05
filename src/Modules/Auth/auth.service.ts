import { ConflictException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../Prisma/prisma.service';
import { decrypt, encrypt } from 'src/tools/data.crypt';
import { CreateUserDto } from './models/create-user.dto';
import { TokenService } from '../ozon/performance/utils/token/token.service';
import { TaskService } from '../../Tasks/tasks.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly token: TokenService,
    @Inject(forwardRef(() => TaskService))
    private readonly task: TaskService,
    
  ) {}

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  async createUser(dto: CreateUserDto) {

    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { tgId: dto.tgId },
          { tableSheetId: dto.tableSheetId },
        ]
      },
      select: {
        tableSheetId: true,
        tgId: true
      }
    });
    
    if (existingUser) {
      const conflicts: string[] = [];
      if (existingUser.tableSheetId === dto.tableSheetId) conflicts.push('tableSheetId');
      if (existingUser.tgId === dto.tgId) conflicts.push('tgId');
      
      throw new ConflictException(`User already existis`);
    };


    const userCreate = await this.prisma.users.create({
      data: {
        tableSheetId: dto.tableSheetId,
        tgId: dto.tgId,
      },
    });

    
    


    return userCreate;
  };

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  };

  async getDecryptedUserSecrets(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }});
    if (user) {
      return {
        apiKey: await decrypt(user.apiKey),
        clientPerformanceId: await decrypt(user.clientPerforId || ""),
        clientSecret: await decrypt(user.clientSecret || ""),
        clientId: await decrypt(user.clientId),
        mpstat: await decrypt(user.mpStatToken || "")
      };
    } else {
      return {};
    };
  };

  async getIdTable(req: any) {
    const url = req.originalUrl;
    console.log(url)
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
  
}