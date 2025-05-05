import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class WbAnalyticsRepository {

  constructor(
    private readonly prismaService: PrismaService
  ) {} 

  async get() {}

  async set() {}

}