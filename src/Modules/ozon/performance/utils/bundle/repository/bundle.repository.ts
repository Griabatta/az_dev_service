import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable() 
export class BundleRepo {
    constructor(
        private readonly prisma: PrismaService
    ) {

    }

    async getBundleByUserId(userId: number) {
        return this.prisma.bundle.findMany({
            where: { userId }
        })
    };

    async getBundleAll() {
        return this.prisma.bundle.findMany();
    }

    async createBundle(data: Prisma.BundleCreateInput) {
        return this.prisma.bundle.create({
            data: data
        })
    };

    async createManyBundle(data:any) {
        return this.prisma.bundle.createMany({
            data: data
        })
    };

    async updateBundle(id, data: Prisma.BundleUpdateInput) {
        return this.prisma.bundle.update({
            where: { id },
            data: data
        })
    };

    async updateStatusBundle(id: number, status: string) {
        return this.prisma.bundle.update({
            where: {id},
            data: {
                status
            }
        })
    }

    async upsertBundle(campaigns: string[], data: Prisma.BundleUncheckedCreateInput) {
        return this.prisma.bundle.upsert({
            where: {campaigns},
            update: data,
            create: data
        })
    }
}