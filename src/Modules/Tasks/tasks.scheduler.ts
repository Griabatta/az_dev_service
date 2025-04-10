import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TaskService } from "./tasks.service";
import { PrismaService } from "../Prisma/prisma.service";


@Injectable()
export class TaskSchedule implements OnModuleInit {
    private readonly logger = new Logger(TaskSchedule.name);

    constructor (
        private readonly taskSerivce: TaskService,
        private readonly prisma: PrismaService
    ) {}


    onModuleInit() {
        this.createSellerTasks();
    };

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleSellerTasks() {
        this.logger.log('Running seller tasks check...');
        await this.taskSerivce.processTasksByType('SELLER');
    }

    @Cron(CronExpression.EVERY_5_HOURS)
    async createSellerTasks() {
      const users = await this.prisma.user.findMany();
      for (const user of users) {
        const tasks = await this.prisma.task.findMany({
            where: {
                userId: user.id,
                type: 'SELLER'
            }
        });
        if (tasks.length > 0) {
            continue;
        }
        const serviceSeller: string[] = ['analytics', 'stock', 'product', 'transaction'];
        let data:any = [];
        serviceSeller.forEach((service: string) => {
          data.push({
            type: "SELLER",
            serviceName: service,
            status: 'PENDING',
            userId: user.id
          })
        })
        try {
          await this.taskSerivce.createManyTask(data);
          this.logger.log("Tasks for Seller created");
        } catch (e) {
          this.logger.error("Tasks for Seller create failed");
        }
      }
    }
}