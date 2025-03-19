import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { clientId, apiKey, clientSecret, mpStatToken } = createUserDto;

    // Хэшируем apiKey и clientSecret
    const saltRounds = 10;
    const apiKeyHash = await bcrypt.hash(apiKey, saltRounds);
    const clientSecretHash = await bcrypt.hash(clientSecret, saltRounds);

    // Создаем пользователя в базе данных
    const user = await this.prisma.user.create({
      data: {
        clientId,
        apiKeyHash,
        clientSecretHash,
        mpStatToken,
      },
    });

    // Возвращаем пользователя без хэшированных данных
    const { apiKeyHash: _, clientSecretHash: __, ...result } = user;
    return result;
  }
}