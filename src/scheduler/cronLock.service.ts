// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/Modules/Prisma/prisma.service';

// @Injectable()
// export class CronLockService {
//   constructor(private readonly prisma: PrismaService) {}

//   async acquireLock(lockName: string, timeoutMs = 60000): Promise<boolean> {
//     try {
//       // Пытаемся создать или обновить запись блокировки
//       const lock = await this.prisma.cronLock.upsert({
//         where: { name: lockName },
//         update: {
//           isLocked: true,
//           lockedAt: new Date(), 
//         },
//         create: {
//           name: lockName,
//           isLocked: true,
//           lockedAt: new Date(),
//         },
//       });

//       // Проверяем, не устарела ли существующая блокировка
//       if (lock.lockedAt && new Date().getTime() - lock.lockedAt.getTime() > timeoutMs) {
//         // Блокировка устарела, снимаем ее
//         await this.prisma.cronLock.update({
//           where: { name: lockName },
//           data: { isLocked: false, lockedAt: null },
//         });
//         return true;
//       }

//       return !lock.isLocked;
//     } catch (error) {
//       return false;
//     }
//   }

//   async releaseLock(lockName: string): Promise<void> {
//     await this.prisma.cronLock.update({
//       where: { name: lockName },
//       data: { isLocked: false, lockedAt: null },
//     });
//   }
// }