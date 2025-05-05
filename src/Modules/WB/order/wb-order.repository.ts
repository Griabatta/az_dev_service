import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateWbOrderRecord } from "./wb-order.dto";


@Injectable()
export class WbOrderRepository {

  constructor (
    private readonly prismaService: PrismaService
  ) {}

  async createOrderManyRecord(data: CreateWbOrderRecord[]) {
    return await this.prismaService.ordersWb.createMany({
      data
    });
  };

  async createOrderRecord(data: CreateWbOrderRecord) {
    return await this.prismaService.ordersWb.create({
      data
    });
  };

    async upserOrdersManyRecord(data: CreateWbOrderRecord[]) {
        const BATCH_SIZE = 30;
        const batches: CreateWbOrderRecord[][] = [];
        
        if (data.length < BATCH_SIZE) {
        try {
            await this.prismaService.$transaction(
            data.map(data => 
                this.prismaService.ordersWb.upsert({
                where: { nmIdCreatedAt: data.nmIdCreatedAt },
                update: data,
                create: data
                })
            )
            );
            return { message: "OK", code: 200 };
        } catch (e) {
            return { 
            message: e.message || e.text || "Unknown error", 
            code: e.code || e.status || 500 
            };
        }
        }
    
        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            batches.push(data.slice(i, i + BATCH_SIZE));
        }
    
        let successBatch = 0;
    
        for (const batch of batches) {
            try {
            await this.prismaService.$transaction(
                batch.map(data => 
                this.prismaService.ordersWb.upsert({
                where: { nmIdCreatedAt: data.nmIdCreatedAt },
                update: data,
                create: data
                })
                )
            );
            successBatch++;
            } catch (e) {
            console.error(`Ошибка в батче ${successBatch + 1}:`, e.message);
            
            }
        }
    
        if (successBatch === batches.length) {
            return { 
            message: `Completed batch: ${successBatch}/${batches.length}. OK`, 
            code: 200 
            };
            } else if (successBatch > 0) {
            return { 
            message: `Completed batch: ${successBatch}/${batches.length}. Partial success`, 
            code: 206 
            };
            } else {
            return { 
            message: `Completed batch: ${successBatch}/${batches.length}. All failed`, 
            code: 500 
            };
        }
    }


}