import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';
import { encrypt } from 'src/tools/data.crypt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { clientId, apiKey, clientSecret, mpStatToken } = createUserDto;

    const apiKeyHash = await encrypt(apiKey);
    const clientSecretHash = await encrypt(clientSecret);

    const user = await this.prisma.user.create({
      data: {
        clientId,
        apiKeyHash,
        clientSecretHash,
        mpStatToken,
      },
    });
    const { apiKeyHash: _, clientSecretHash: __, ...result } = user;
    return result;
  }

  async getUsers(res: Response) {
    try {
        const users = await this.prisma.user.findMany(); 
        res.status(200).json({ message: "Users:", users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  }
}