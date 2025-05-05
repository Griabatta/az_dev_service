import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { CreateWBStockRecord } from "./wb-stock.dto";


@Injectable()
export class WbStockRepository {

  constructor(
      private readonly prismaService: PrismaService
    ) {}
  
    async createStockManyRecord(data: CreateWBStockRecord[]) {
        return await this.prismaService.stockWb.createMany({
          data
        });
      };
    
      async createStockRecord(data: CreateWBStockRecord) {
        return await this.prismaService.stockWb.create({
          data
        });
      };
    
      async upserStockManyRecord(data: CreateWBStockRecord[]) {
        const BATCH_SIZE = 30;
        const batches: CreateWBStockRecord[][] = [];
        
        if (data.length < BATCH_SIZE) {
        try {
            await this.prismaService.$transaction(
            data.map(data => 
                this.prismaService.stockWb.upsert({
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
    
        // Разбивка на батчи
        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            batches.push(data.slice(i, i + BATCH_SIZE));
        }
    
        let successBatch = 0;
    
        // Обработка батчей
        for (const batch of batches) {
            try {
            await this.prismaService.$transaction(
                batch.map(data => 
                this.prismaService.stockWb.upsert({
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
    
        // Формирование результата
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