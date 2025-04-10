import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import { OzonSellerService } from "../Seller/ozon_seller.service";
import { ReviewService } from "../Seller/ozon_review.service";



@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor (
    private readonly prisma: PrismaService,
    private readonly seller: OzonSellerService,
    // private readonly review: ReviewService
  ) {}

  async createTask(
    type: string,
    serviceName: string,
    userId: number,
    metadata?: any
  ) {
    return await this.prisma.task.create({
      data: {
        type,
        serviceName,
        status: 'PENDING',
        metadata,
        userId: userId
      }
    });
  }

  async createManyTask(data: any) {
    return await this.prisma.task.createMany({
      data
    });
  }

  async updateTaskStatus(taskId: number, status: string) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
  }

  async completeTask(taskId: number, result?: any) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        metadata: result
      }
    });
  }

  

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async handlePerformanceTasks() {
  //   this.logger.log('Running performance tasks check...');
  //   await this.processTasksByType('PERFORMANCE');
  // }

  async processTasksByType(type: string) {
    // const pendingTasks = await this.prisma.task.findMany({
    //   where: {
    //     type,
    //     status: 'PENDING'
    //   },
    //   take: 100
    // });
    const users = await this.prisma.user.findMany();
    users.map(async user => {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: user.id,
          status: 'PENDING',
          type
        },
        take: 100
      });
      tasks.map(async task => {
        try {

          await this.updateTaskStatus(task.id, 'IN_PROGRESS');
  
          const result = await this.processTask(task, user);
  
          await this.completeTask(task.id, result);

        } catch (error) {

          this.logger.error(`Task ${task.id} failed: ${error.message}`);

          await this.prisma.task.update({
            where: { id: task.id },
            data: { status: 'FAILED' }
          });
        }
      })
    })
  }

  private async processTask(task: any, user: any) {
    switch (task.serviceName) {
      case 'analytics':
        return this.handleAnalyticsSync(task, user);
      case 'stock':
        return this.handleStockSync(task, user);
      // case 'review':
      //   return this.handleReviewSync(task, user);
      case 'product':
        return this.handleProductSync(task, user);
      case 'transaction':
        return this.handleTransactionSync(task, user);
      default:
        throw new Error(`Unknown service: ${task.serviceName}`);
    }
  }

  private async handleAnalyticsSync(task: any, user: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportAnalytics(user);
    return { synced: true, count: 100 };
  }

  private async handleStockSync(task: any, user: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportStock(user);
    return { synced: true, count: 100 };
  }

  private async handleTransactionSync(task: any, user: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportTransaction(user);
    return { synced: true, count: 100 };
  }

  // private async handleReviewSync(task: any, user: any) {
  //   this.logger.log(`Processing product sync for task ${task.id}`);
  //   await this.review.fetchAndImportReviews(user);
  //   return { synced: true, count: 100 };
  // }

  private async handleProductSync(task: any, user: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportProduct(user);
    return { synced: true, count: 100 };
  }

  async triggerManualTask(type: string, serviceName: string, userId: number) {
    const task = await this.createTask(type, serviceName, userId);
    await this.processTasksByType(type);
    return task;
  }




 

}