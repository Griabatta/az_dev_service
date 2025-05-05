import { Injectable } from '@nestjs/common';
import { JournalErrorsRepository } from './repositories/error.repository';

@Injectable()
export class JournalErrorsService {
  constructor(private readonly errorsRepo: JournalErrorsRepository) {}

  // Основной метод логирования ошибок
  async logError(params: {
    userId: number;
    message: string;
    priority: number;
    code?: string;
    serviceName: string;
  }) {
    return this.errorsRepo.create({
      errorUserId: params.userId,
      errorMassage: params.message,
      errorPriority: params.priority,
      errorCode: params.code || 'UNKNOWN',
      errorServiceName: params.serviceName,
    });
  }

  // Примеры конкретных ошибок
  async logInternalError(userId: number, error: Error) {
    return this.logError({
      userId,
      message: error.message || 'Unexpected error',
      priority: 3,
      code: '500',
      serviceName: 'Global/Internal',
    });
  }

  async logUnauthorizedError(userId: number) {
    return this.logError({
      userId,
      message: 'Unauthorized. No Client-Id or Api-key',
      priority: 3,
      code: '401',
      serviceName: 'Auth/Guard',
    });
  }

  async logValidationError(userId: number, message: string) {
    return this.logError({
      userId,
      message,
      priority: 2,
      code: '400',
      serviceName: 'Validation',
    });
  }

  // Получение ошибок
  async getUserErrors(userId: number) {
    return this.errorsRepo.findByUserId(userId);
  }

  async getCriticalErrors() {
    return this.errorsRepo.findWithFilters({ priority: 3 });
  }
}