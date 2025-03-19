import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect(); // Подключаемся к базе данных при старте приложения
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Отключаемся от базы данных при остановке приложения
  }
}