import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TaskService } from "./tasks.service";
import { PrismaService } from "../Prisma/prisma.service";
import { OzonPerformanceService } from "../Modules/ozon/performance/ozon_performance.service";


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
      // this.trafStartTask();
      // this.bannerStartTask();
      // this.serachStartTask();
      // this.createAnalytics();
    };

    @Cron('*/30 * * * *')
    async analyticsStartTask() {
      await this.taskSerivce.processTaskBySeviceName('analytics')
    };

    @Cron('*/40 * * * *')
    async skuStartTask() {
      await this.taskSerivce.processTaskBySeviceName('sku')
    }

    @Cron('0 */01 * * *')
    async stockAnalyticStartTask() {
      await this.taskSerivce.processTaskBySeviceName('stock')
    }    

    @Cron('30 */01 * * *')
    async transactionStartTask() {
      await this.taskSerivce.processTaskBySeviceName('transaction')
    }

    @Cron('0 */02 * * *')
    async produtcStartTask() {
      await this.taskSerivce.processTaskBySeviceName('product')
    }

    @Cron('30 */02 * * *')
    async trafStartTask() {
      await this.taskSerivce.processTaskBySeviceName('traf')
    }

    @Cron('0 */03 * * *')
    async serachStartTask() {
      await this.taskSerivce.processTaskBySeviceName('search')
    }

    @Cron('30 */03 * * *')
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

    @Cron('0 */05 * * *')
    async createAnalyticsTask() {
      await this.taskSerivce.createTaskForAllUsers('analytics', "SELLER")
    }

    @Cron('* */23 * * *')
    async createStockTask() {
      await this.taskSerivce.createTaskForAllUsers('stock', "SELLER")
    }

    @Cron('* * */1 * *')
    async createSkuTask() {
      await this.taskSerivce.createTaskForAllUsers('sku', "SELLER")
    }
    
    @Cron('20 */05 * * *')
    async createTransactionTask() {
      await this.taskSerivce.createTaskForAllUsers('transaction', "SELLER")
    }

    @Cron('40 */05 * * *')
    async createProductTask() {
      await this.taskSerivce.createTaskForAllUsers('product', "SELLER")
    }

    @Cron('50 */05 * * *')
    async createTrafTask() {
      await this.taskSerivce.createTaskForAllUsers('traf', "PERFORMANCE")
    }

    @Cron('10 */06 * * *')
    async createSearchTask() {
      await this.taskSerivce.createTaskForAllUsers('search', "PERFORMANCE")
    }

    @Cron('20 */06 * * *')
    async createBannerTask() {
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