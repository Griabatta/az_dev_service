import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumberString, isString } from 'class-validator';
import { IsDate, IsNumber } from 'class-validator';

export class CampaignDto {
  @IsString()
  id: string;

  @IsString()
  templateId: string;

  @IsString()
  title: string;

  @IsNumber()
  userId: number;

  @IsString()
  state: string;

  @IsString()
  advObjectType: string;

  @IsDate()
  fromDate: Date;

  @IsDate()
  @IsOptional()
  toDate?: Date;

  @IsString()
  dailyBudget: number;

  @IsString()
  budget: number;

  @IsString()
  @IsOptional()
  maxBid?: number;

  @IsString()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  skuAddMode?: string;

  @IsString()
  placement: string;

  @IsString()
  paymentType: string;

  @IsString()
  weeklyBudget: number;

  @IsString()
  budgetType: string;

  @IsString()
  productCampaignMode: string;

  @IsString()
  startWeekDay: string;

  @IsString()
  endWeekDay: string;

  @IsString()
  filter: string;

  @IsString()
  productAutopilotStrategy: string;

  @IsString()
  expenseStrategy: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
// Для создания кампании (без ID и дат)
export class CreateCampaignDto extends OmitType(CampaignDto, [
  'id', 
  'createdAt', 
  'updatedAt'
] as const) {}

// Для обновления (все поля опциональны)
export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}