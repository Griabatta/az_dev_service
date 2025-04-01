import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Modules/Prisma/prisma.service";


@Injectable()
export class UserRep {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getAllUser() {
        return this.prisma.user.findMany()
    };

    async getUserTokenByUserId(userId: number) {
        return this.prisma.user.findFirst({
            where: {id: userId}
        })
    }

    async getUserById(id: number) {
        return this.prisma.user.findUnique({
            where: {id}
        })
    }
}