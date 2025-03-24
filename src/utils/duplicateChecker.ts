import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Modules/Prisma/prisma.service';

@Injectable()
export class DuplicateChecker {
  constructor(private readonly prisma: PrismaService) {}

  async checkAndFilterDuplicates(type: string, data: any[], keys: string[]): Promise<any[] | string> {
    if (!Array.isArray(data)) {
      throw new TypeError('Data must be an array');
    }

    let existingData;
    const today = new Date().toISOString().slice(0, 10);

    switch (type) {
      case 'analytics':
        existingData = await this.prisma.analytics.findMany({
          where: {
            createAt: {
              gte: new Date(today)
            }
          }
        });
        break;
      case 'stock':
        existingData = await this.prisma.stock_Warehouse.findMany({
          where: {
            createAt: {
              gte: new Date(today)
            }
          }
        });
        break;
      case 'transactions':
        existingData = await this.prisma.transaction_List.findMany({
          where: {
            createAt: {
              gte: new Date(today)
            }
          }
        });
        break;
      case 'products':
        existingData = await this.prisma.product_List.findMany({
          where: {
            createAt: {
              gte: new Date(today)
            }
          }
        });
        break;
      default:
        return data;
    }

    const filteredData = data.filter(item => {
      return !existingData.some(existingItem => {
        return keys.every(key => {
          const itemValue = item[key];
          const existingItemValue = existingItem[key];
          if (itemValue instanceof Date && existingItemValue instanceof Date) {
            return itemValue.toISOString().slice(0, 10) === existingItemValue.toISOString().slice(0, 10);
          }
          return itemValue === existingItemValue;
        });
      });
    });

    return filteredData;
  }
}
