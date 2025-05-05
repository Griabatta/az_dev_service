import { Injectable } from "@nestjs/common";
import { createUserDTO } from "./dto";
import { PrismaService } from "src/Prisma/prisma.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService
    ) {
    }

    async signUp(authData: createUserDTO) {

        if (!authData) {
            return {message: "No data", code: "404"}
        }

        try {
            const existingUser = await this.prismaService.users.findFirst({
                where: {
                OR: [
                    { tgId: authData.tgId },
                    { tableSheetId: authData.tableSheetId },
                ]
                },
                select: {
                tableSheetId: true,
                tgId: true
                }
            });
            
            if (existingUser) {
                const conflicts: string[] = [];
                if (existingUser.tableSheetId === authData.tableSheetId) conflicts.push('tableSheetId');
                if (existingUser.tgId === authData.tgId) conflicts.push('tgId');
                
                return {message: `User already existis`, code: 409};
            };
        
        
            const userCreate = await this.prismaService.users.create({
                data: {
                tableSheetId: authData.tableSheetId,
                tgId: authData.tgId,
                },
            });
            
            return {message: "Ok", code: 200};
        } catch (e) {
            return { message: e.message || e.text, code: e.code || e.status}
        };
    }

    async logIn(cliendId: string) {

    }
}