import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import { OzonSellerService } from "../Modules/ozon/Seller/ozon_seller.service";
import { ReviewService } from "../Modules/ozon/Seller/ozon_review.service";
import { OzonPerformanceService } from "../Modules/ozon/performance/ozon_performance.service";



@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor (
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => OzonSellerService))
    private readonly seller: OzonSellerService,
    @Inject(forwardRef(() => OzonPerformanceService))
    private readonly perfor: OzonPerformanceService
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
    const ret =  this.prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
    return ret;
  }

  async completeTask(taskId: number, result?: any) {
    const ret =  this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        metadata: result
      }
    });
    return ret;
  }

  async processTaskBySeviceName(serviceName: string) {
    
    const users: any[] = await this.prisma.user.findMany();
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { serviceName, status: "PENDING" },
          { serviceName, status: "IN_PROGRESS"}
        ]
      }
    });
    
    if (users.length === 0 || tasks.length === 0) {
      this.logger.error(`Users or Tasks not found. not found. Skip. ServiceName: ${serviceName}`);
      return;
    }
    
  
    const userTaskMap = new Map<number, { taskId: number; serviceName: string }>();
    tasks.forEach(task => userTaskMap.set(task.userId, {taskId: task.id, serviceName}));
    const promiseTask = users.map(async user => {
      const task = userTaskMap.get(user.id);
      if (!task) {
        this.logger.debug("NOT TASK ID")
        return
      }
      try {
        await this.updateTaskStatus(task?.taskId, 'IN_PROGRESS');
        user.taskId = task.taskId;
        const result = await this.processTask(serviceName, user);
        await this.completeTask(task.taskId, result);
      } catch (error) {
        this.logger.error(`Task failed for user ${user.id}:`, error);
        await this.updateTaskStatus(task.taskId, 'FAILED');
      }
    })
    Promise.all(promiseTask)
    .catch(e => {
      this.logger.error(e)
    });
  }

  

  // async processTasksByType(type: string) {
  //   // const pendingTasks = await this.prisma.task.findMany({
  //   //   where: {
  //   //     type,
  //   //     status: 'PENDING'
  //   //   },
  //   //   take: 100
  //   // });
  //   const users = await this.prisma.user.findMany();
  //   if (!users) {
  //     this.logger.warn("Users not found");
  //     return
  //   }
  //   users.map(async user => {
  //     const tasks = await this.prisma.task.findMany({
  //       where: {
  //         userId: user.id,
  //         status: 'PENDING',
  //         type
  //       },
  //       take: 100
  //     });
  //     tasks.map( task => {
  //       try {
  //         setTimeout(() => {
            
  //         }, 2000);
  //          this.updateTaskStatus(task.id, 'IN_PROGRESS');
  
  //         const result =  this.processTask(task, user);
  
  //          this.completeTask(task.id, result);

  //       } catch (error) {

  //         this.logger.error(`Task ${task.id} failed: ${error.message}`);
  //          this.updateTaskStatus(task.id, 'FAILED');
  //         // await this.prisma.task.update({
  //         //   where: { id: task.id },
  //         //   data: { status: 'FAILED' }
  //         // });
  //       }
  //     })
  //   })
  // }

  private async processTask(serviceName: any, user: any) {
    this.logger.debug(serviceName)
    switch (serviceName) {
      case 'analytics':
        return this.handleAnalyticsSync(user);
      // 
      // case 'review':
      //   return this.handleReviewSync(task, user);
      case 'product':
        return this.handleProductSync(user);
      case 'transaction':
        return this.handleTransactionSync(user);
      case 'traf':
        return this.handleTrafSync(user);
      case 'search':
        return this.handleSearchSync(user);
      case 'banner':
        return this.handlBanerSync(user);
      case 'sku':
        return this.handleSKUSync(user);
      case 'stock':
        return this.handleStockAnalytickSync(user);
      default:
        throw new Error(`Unknown service: ${user.serviceName}`);
    }
  }

  private async handleTrafSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    user.typeRequest = "SKU"
    await this.perfor.getCampaignForType(user);
    return { synced: true, count: 100 };
  }

  private async handleSearchSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    user.typeRequest = "SEARCH_PROMO"
    await this.perfor.getCampaignForType(user);
    return { synced: true, count: 100 };
  }

  private async handlBanerSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    user.typeRequest = "BANNER"
    await this.perfor.getCampaignForType(user);
    return { synced: true, count: 100 };
  }

  private async handleAnalyticsSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    await this.seller.fetchAndImportAnalytics(user);
    return { synced: true, count: 100 };
  }

  private async handleStockAnalytickSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    await this.seller.fetchAndImportStockAnalytics(user);
    return { synced: true, count: 100 };
  }

  private async handleSKUSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    await this.seller.fetchAndImportSKUList(user);
    return { synced: true, count: 100 };
  }

  private async handleTransactionSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    await this.seller.fetchAndImportTransaction(user);
    return { synced: true, count: 100 };
  }

  // private async handleReviewSync(task: any, user: any) {
  //   this.logger.log(`Processing product sync for task ${task.id}`);
  //   await this.review.fetchAndImportReviews(user);
  //   return { synced: true, count: 100 };
  // }

  private async handleProductSync(user: any) {
    this.logger.log(`Processing product sync for task ${user.taskId}`);
    await this.seller.fetchAndImportProduct(user);
    return { synced: true, count: 100 };
  }

  // async triggerManualTask(type: string, serviceName: string, userId: number) {
  //   const task = await this.createTask(type, serviceName, userId);
  //   await this.processTasksByType(type);
  //   return task;
  // }

  async createTaskForNewUser(user: any) {
    const serviceSellerName: string[] = ['analytics', 'stock', 'transaction', 'product', 'sku']
    const servicePerfrorName: string[] = ['traf', 'search', 'banner']
    let dataForCreateTask: object[] = [];
    serviceSellerName.map(service => {
      dataForCreateTask.push({
        type: 'SELLER',
        serviceName: service,
        userId: user.id,
        status: "PENDING",
        createdAt: new Date()
      })
    });
    servicePerfrorName.map(service => {
      dataForCreateTask.push({
        type: 'PERFORMANCE',
        serviceName: service,
        userId: user.id,
        status: "PENDING",
        createdAt: new Date()
      })
    });
    await this.createManyTask(dataForCreateTask);
    this.logger.log("Tasks for Campaigns created");


  }

  async createTaskForAllUsers(serviceName: string, type: string) {

    const users = await this.prisma.user.findMany();
    var dataForCreateTask: object[] = [];
    var userTaskStarted: number[] = [];
    const tasksStarted = await this.prisma.task.findMany({
      where: {
        OR: [
          { 
            type: type,
            status: "IN_PROGRESS",
            serviceName: serviceName
          },
          { 
            type: type,
            status: "PENDING",
            serviceName: serviceName
          }
        ]
      }
    })
    const taskCompletedError = await this.prisma.task.findMany({
      where: {
        type: serviceName,
        status: "FAILED"
      }
    })
    
    if (taskCompletedError.length > 0) { // Если есть ошибка, то мы не создаем новую таску, а отписываемся в журнал об ошибке
      for (const task of taskCompletedError) {// если есть ошибка создания хот ьу одного пользователя, отвалится созадние у всех, тк это должна быть глобальная ошибка
        await this.prisma.journalErrors.create({ // либо непредусмотренная
          data: {                                 // по этому нужно сразу кидать ее в журнал с высшим приоритетом и дебажить
            createdAt: new Date(),
            errorMassage: `The task to get ${serviceName} ended with an error`,
            errorPriority: 3,
            errorCode: '500',
            errorUserId: task.userId,
            errorServiceName: `${serviceName} task`
          }
        })
      }
      return
    }
    
    if (tasksStarted.length > 0) { // если есть запущенные у пользователей, то смотрим только тех, у кого нет запущенных, запущенные пропускаем, чтобы не переполнять стек
      tasksStarted.map(task => {
        userTaskStarted.push(task.userId)
      })
    };

    for (const user of users) { // создаем пакет пользователей и настроек для задачки, чтобы отправить сразу пачкой в базу(пропускаем, те, которые имеют запущенные, и ошибки )
      if (!userTaskStarted.includes(user.id)) {
        dataForCreateTask.push({
          type: type,
          serviceName: serviceName,
          userId: user.id,
          status: "PENDING",
          createdAt: new Date()
        })
      }
    }
    
    if (dataForCreateTask.length > 0) {
      try {
        await this.createManyTask(dataForCreateTask);
        this.logger.log(`Tasks for ${serviceName} created`);
      } catch (e) {
        this.logger.error(e.message)
        this.logger.error(`Tasks for ${serviceName} create failed`);
      }
    }

      
    
  }



 

}