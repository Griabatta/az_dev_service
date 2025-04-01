import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../Prisma/prisma.service';
import { decrypt, encrypt } from 'src/tools/data.crypt';
import { CreateUserDto } from './models/create-user.dto';
import { TokenService } from '../performance/utils/token/token.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly token: TokenService
  ) {}

  private async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  async createUser(dto: CreateUserDto) {

    const ClientId = await encrypt(dto.clientId);
    const ApiKey = await encrypt(dto.apiKey);
    const ClientSecret = await encrypt(dto.clientSecret || "");
    const ClientPerforId = await encrypt(dto.clientPerFormanceId || "");
    const mpstat = await encrypt(dto.mpStatToken || "");

    

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { clientId: dto.clientId },
          { apiKey: dto.apiKey },
          { clientPerforId: dto.clientSecret || undefined }, // Обработка optional полей
          { clientSecret: dto.clientPerFormanceId || undefined }
        ]
      },
      select: {
        clientId: true,
        apiKey: true,
        clientPerforId: true,
        clientSecret: true
      }
    });
    
    if (existingUser) {
      const conflicts: string[] = [];
      if (existingUser.clientId === dto.clientId) conflicts.push('clientId');
      if (existingUser.apiKey === dto.apiKey) conflicts.push('apiKey');
      if (existingUser.clientPerforId === dto.clientPerFormanceId) conflicts.push('clientPerforId');
      if (existingUser.clientSecret === dto.clientSecret) conflicts.push('clientSecret');
      
      throw new ConflictException(`User already existis`);
    };


    const userCreate = await this.prisma.user.create({
      data: {
        clientId: ClientId,
        apiKey: ApiKey,
        clientPerforId: ClientPerforId,
        clientSecret: ClientSecret,
        email: dto.email,
        tableSheetId: dto.tableSheetId,
        tgId: dto.tgId,
        name: dto.name,
        mpStatToken: mpstat,
      },
    });

    
    const userCreated = await this.prisma.user.findFirst({
      where: {
        clientId: ClientId
      },
      select: {
        id: true,
        clientPerforId: true,
        clientSecret: true
      }
    })

    const paramsForToken = {
      userId: userCreated?.id,
      clientPerForId: await decrypt(userCreated?.clientPerforId || ""),
      clientSecret: await decrypt(userCreated?.clientSecret || "")
    };


    if (userCreated) {
      await this.token.createToken(paramsForToken)
    }


    return userCreate;
  };

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        tgId: true,
        tableSheetId: true
      },
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