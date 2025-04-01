// performance/models/performance.dto.ts


  
  export class CampaignTemplateDto {
    id?: number;
    templateId: string;
    name: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    userId: number
    // Другие поля из ответа API
  }
  
  export class GetTemplatesRequestDto {
    userId: number;
    days: number = 60; // Дефолтное значение 60 дней
  }
  
  export class TemplateResponseDto {
    success: boolean;
    data?: CampaignTemplateDto[];
    error?: string;
  }