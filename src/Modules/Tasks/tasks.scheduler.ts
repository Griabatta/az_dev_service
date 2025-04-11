import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TaskService } from "./tasks.service";
import { PrismaService } from "../Prisma/prisma.service";
import { OzonPerformanceService } from "../performance/ozon_performance.service";


@Injectable()
export class TaskSchedule implements OnModuleInit {
    private readonly logger = new Logger(TaskSchedule.name);

    constructor (
        private readonly taskSerivce: TaskService,
        private readonly prisma: PrismaService,
        private readonly perfor: OzonPerformanceService
    ) {}


    onModuleInit() {
      //seller
        // this.analyticsStartTask();
        // this.stockStartTask();
      //   this.transactionStartTask();
      //   this.produtcStartTask();
      // //stock
      //   this.trafStartTask();
      //   this.serachStartTask();
      //   this.bannerStartTask();
    };

    @Cron('20 * * * *')
    async analyticsStartTask() {
      await this.taskSerivce.processTaskBySeviceName('analytics')
    };

    @Cron('22 * * * *')
    async stockStartTask() {
      await this.taskSerivce.processTaskBySeviceName('stock')
    }

    @Cron('24 * * * *')
    async transactionStartTask() {
      await this.taskSerivce.processTaskBySeviceName('transaction')
    }

    @Cron('28 * * * *')
    async produtcStartTask() {
      await this.taskSerivce.processTaskBySeviceName('product')
    }

    @Cron('30 * * * *')
    async trafStartTask() {
      await this.taskSerivce.processTaskBySeviceName('traf')
    }

    @Cron('32 * * * *')
    async serachStartTask() {
      await this.taskSerivce.processTaskBySeviceName('search')
    }

    @Cron('34 * * * *')
    async bannerStartTask() {
      await this.taskSerivce.processTaskBySeviceName('banner')
    }


    // @Cron(CronExpression.EVERY_10_MINUTES)
    // async handlePerformanceTasks() {
    //   this.logger.log('Running performance tasks check...');
    //   await this.taskSerivce.processTasksByType('PERFORMANCE');
    // }

    // @Cron(CronExpression.EVERY_5_MINUTES)
    // async handleSellerTasks() {
    //     this.logger.log('Running seller tasks check...');
    //     await this.taskSerivce.processTasksByType('SELLER');
    // }

    @Cron('0 */5 * * *')
    async createAnalytics() {
      await this.taskSerivce.createTaskForAllUsers('analytics', "SELLER")
    }

    @Cron('2 */5 * * *')
    async createStock() {
      await this.taskSerivce.createTaskForAllUsers('stock', "SELLER")
    }
    
    @Cron('4 */5 * * *')
    async createTransaction() {
      await this.taskSerivce.createTaskForAllUsers('transaction', "SELLER")
    }

    @Cron('6 */5 * * *')
    async createProduct() {
      await this.taskSerivce.createTaskForAllUsers('product', "SELLER")
    }

    @Cron('8 */5 * * *')
    async createTraf() {
      await this.taskSerivce.createTaskForAllUsers('traf', "PERFORMANCE")
    }

    @Cron('10 */5 * * *')
    async createSearch() {
      await this.taskSerivce.createTaskForAllUsers('search', "PERFORMANCE")
    }

    @Cron('12 */5 * * *')
    async createBanner() {
      await this.taskSerivce.createTaskForAllUsers('banner', "PERFORMANCE")
    }

    // @Cron(CronExpression.EVERY_5_HOURS)
    // async createPerCampaignsTasks() {
    //   const users = await this.prisma.user.findMany();
    //   for (const user of users) {
    //     const tasks = await this.prisma.task.findMany({
    //         where: {
    //             userId: user.id,
    //             type: 'PERFORMANCE'
    //         }
    //     });
    //     if (tasks.length > 0) {
    //       let taskFinishLenght = 0;
    //       tasks.map(task => {
    //         if (task.status === "COMPLETED") {
    //           taskFinishLenght++;
    //         }
    //       })
    //       if (tasks.length !== taskFinishLenght) {
    //         this.logger.debug("Tasks in progress")
    //         return 
    //       }
    //     }
    //     const serviceSeller: string[] = ['traf', 'search', 'baner'];
    //     let data:any = [];
    //     serviceSeller.forEach((service: string) => {
    //       data.push({
    //         type: "PERFORMANCE",
    //         serviceName: service,
    //         status: 'PENDING',
    //         userId: user.id
    //       })
    //     })
    //     try {
    //       await this.taskSerivce.createManyTask(data);
    //       this.logger.log("Tasks for Campaigns created");
    //     } catch (e) {
    //       this.logger.error("Tasks for Campaigns create failed");
    //     }
    //   }
    // }

    // @Cron(CronExpression.EVERY_5_HOURS)
    // async createSellerTasks() {
    //   const users = await this.prisma.user.findMany();
    //   for (const user of users) {
    //     const tasks = await this.prisma.task.findMany({
    //         where: {
    //             userId: user.id,
    //             type: 'SELLER'
    //         }
    //     });
    //     if (tasks?.length > 0) {
    //       let taskFinishLenght = 0;
    //       tasks.map(task => {
    //         if (task.status === "COMPLETED") {
    //           taskFinishLenght++;
    //         }
    //       })
    //       if (tasks.length !== taskFinishLenght) {
    //         this.logger.debug("Tasks in progress")
    //         return 
    //       }
    //     }
    //     const serviceSeller: string[] = ['analytics', 'stock', 'product', 'transaction'];
    //     let data:any = [];
    //     serviceSeller.forEach((service: string) => {
    //       data.push({
    //         type: "SELLER",
    //         serviceName: service,
    //         status: 'PENDING',
    //         userId: user.id
    //       })
    //     })
    //     try {
    //       await this.taskSerivce.createManyTask(data);
    //       this.logger.log("Tasks for Seller created");
    //     } catch (e) {
    //       this.logger.error("Tasks for Seller create failed");
    //     }
    //   }
    // }
}