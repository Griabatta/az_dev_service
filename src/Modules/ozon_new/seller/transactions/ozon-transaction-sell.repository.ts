import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class OzonTransactionsSellRepository {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

    

}