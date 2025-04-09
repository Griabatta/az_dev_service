import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OzonSellerService } from "../Seller/ozon_seller.service";
import { ReviewService } from "../Seller/ozon_review.service";



@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor (
    private readonly prisma: PrismaService,
    private readonly seller: OzonSellerService,
    private readonly review: ReviewService
  ) {}

  // Создание задачи
  async createTask(
    type: string,
    serviceName: string,
    metadata?: any
  ) {
    return await this.prisma.task.create({
      data: {
        type,
        serviceName,
        status: 'PENDING',
        metadata
      }
    });
  }

  // Обновление статуса задачи
  async updateTaskStatus(taskId: string, status: string) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
  }

  // Завершение задачи
  async completeTask(taskId: string, result?: any) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        metadata: result
      }
    });
  }

  // 3. CRON задачи по типам
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleSellerTasks() {
    this.logger.log('Running seller tasks check...');
    await this.processTasksByType('SELLER');
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async handlePerformanceTasks() {
  //   this.logger.log('Running performance tasks check...');
  //   await this.processTasksByType('PERFORMANCE');
  // }

  // 4. Основная логика обработки задач
  private async processTasksByType(type: string) {
    const pendingTasks = await this.prisma.task.findMany({
      where: {
        type,
        status: 'PENDING'
      },
      take: 100
    });

    for (const task of pendingTasks) {
      try {
        // Помечаем задачу как "в процессе"
        await this.updateTaskStatus(task.id, 'IN_PROGRESS');

        // Обработка в зависимости от сервиса
        const result = await this.processTask(task);

        // Помечаем как выполненную
        await this.completeTask(task.id, result);
      } catch (error) {
        this.logger.error(`Task ${task.id} failed: ${error.message}`);
        await this.prisma.task.update({
          where: { id: task.id },
          data: { status: 'FAILED' }
        });
      }
    }
  }

  // 5. Обработчики для разных сервисов
  private async processTask(task: any) {
    switch (task) {
      case 'analytics':
        return this.handleAnalyticsSync(task);
      case 'stock':
        return this.handleStockSync(task);
      case 'review':
        return this.handleReviewSync(task);
      case 'product':
        return this.handleProductSync(task);
      // case 'transaction':
      // return this.handleTransactionReport(task);
      default:
        throw new Error(`Unknown service: ${task}`);
    }
  }

  // Пример обработчика для сервиса
  private async handleAnalyticsSync(task: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportAnalytics();
    return { synced: true, count: 100 };
  }

  private async handleStockSync(task: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportStock();
    return { synced: true, count: 100 };
  }

  private async handleReviewSync(task: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.review.fetchAndImportReviews();
    return { synced: true, count: 100 };
  }

  private async handleProductSync(task: any) {
    this.logger.log(`Processing product sync for task ${task.id}`);
    await this.seller.fetchAndImportProduct();
    return { synced: true, count: 100 };
  }

  // 6. Метод для ручного запуска задач
  async triggerManualTask(type: string, serviceName: string, userId: number) {
    const task = await this.createTask(type, serviceName);
    await this.processTasksByType(type);
    return task;
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async createSellerTasks() {
    await this.createTask("SELLER", "analytics")
    await this.createTask("SELLER", "stock")
    await this.createTask("SELLER", "review")
    await this.createTask("SELLER", "product")
  }

}