import { Module } from "@nestjs/common";
import { PrismaModule } from "src/Prisma/prisma.module";
import { OzonPerformanceService } from "./ozon-performance.service";
import { OzonPerformanceController } from "./ozon-performance.controller";


@Module({
    imports: [
        PrismaModule
    ],
    providers: [ OzonPerformanceService ],
    controllers: [ OzonPerformanceController ],
    exports: []
})

export class PerfromanceModule {}