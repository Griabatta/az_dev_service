// id        Int       @id @default(autoincrement())
// status    String    @default("In Progress")
// uuid      String    @unique
// type      String    @default("Statistic")

// userId    Int

import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { lightFormat } from "date-fns";


export class CreateReportDTO {

    @IsString()
    @IsOptional()
    type?:        string | undefined

    @IsArray()
    uuid:         string

    @IsString()
    status:       string

    @IsNumber()
    userId:       number

    @IsNumber()
    bundleId:     number
}


export class FetchRawReportDTO {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  campaigns: string[];

  @IsString()
  to?: string

  @IsString()
  from?: string

  @IsString()
  @IsNotEmpty()
  dateFrom: string; // Формат: "YYYY-MM-DD"

  @IsString()
  @IsNotEmpty()
  dateTo: string; // Формат: "YYYY-MM-DD"

  @IsString()
  @IsOptional()
  groupBy?: string = "NO_GROUP_BY"; 
}

export class CampaignItemDTO {
  searchQuery: string = ""; // Дефолтное значение
  sku: string;
  title: string = ""; // Убрали "?", добавили дефолтное значение
  price: string = "0,00";
  views: number = 0;
  clicks: number = 0;
  ctr: string = "0,00";
  toCart: number = 0;
  avgBid: string = "0,00";
  moneySpent: string = "0,00";
  orders: number = 0;
  ordersMoney: string = "0,00";
  models: number = 0;
  modelsMoney: string = "0,00";
  drr: string = "0,00";
  createdAt: Date = new Date();
  createdAtDB: string = lightFormat(new Date(), 'yyyy-MM-dd');
  campaignId: string;
  userId: number;
  type: string;
}

export interface ParsedCampaignItem {
  searchQuery?: string;    // Поисковый запрос
  sku?: string;           // Артикул товара
  title?: string;         // Название товара
  price?: string;         // Цена ("2954,00")
  views?: number;         // Просмотры (число)
  clicks?: number;        // Клики (число)
  ctr?: string;           // CTR ("0,90")
  toCart?: number;        // Добавления в корзину
  avgBid?: string;        // Средняя ставка ("9,35")
  moneySpent?: string;    // Потраченные средства ("2366,80")
  orders?: number;        // Заказы
  ordersMoney?: string;   // Сумма заказов ("0,00")
  models?: number;        // Количество моделей
  modelsMoney?: string;   // Сумма по моделям ("4534,00")
  drr?: string;           // DRR ("52,20")
  createdAt: Date;       // Дата создания (преобразованная в Date)
  createdAtDB: string;
  campaignId: string;    // ID кампании (например, "13652157")
  userId: number;        // ID пользователя
  type: string;          // Тип кампании (например, "product")
}