import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  tgId       :string
  
  @IsString()
  tableSheetId :string
  
  @IsString()
  @IsOptional()
  name        :string
}