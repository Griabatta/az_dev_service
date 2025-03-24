import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  clientId: string; // Будет зашифрован
  
  @IsString()
  apiKey: string; // Будет зашифрован
  
  @IsString()
  clientSecret: string; // Будет зашифрован

  @IsString()
  clientPerFormanceId: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID таблицы Google Sheets', required: true })
  @IsString()
  @IsNotEmpty()
  tableSheetId: string;

  @ApiProperty({ description: 'Telegram ID', required: false })
  @IsString()
  @IsOptional()
  tgId?: string;

  @ApiProperty({ description: 'Имя пользователя', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'MoySklad токен', required: false })
  @IsString()
  @IsOptional()
  mpStatToken?: string;
}