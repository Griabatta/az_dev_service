import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class UserRep {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getAllUser() {
        return this.prisma.users.findMany()
    };

    async getUserTokenByUserId(userId: number) {
        return this.prisma.users.findFirst({
            where: {id: userId}
        })
    }

    async getUserById(id: number) {
        return this.prisma.users.findUnique({
            where: {id}
        })
    }
}