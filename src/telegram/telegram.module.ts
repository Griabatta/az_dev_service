// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegistrationBotService } from './telegram.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [RegistrationBotService],
  exports: [RegistrationBotService]
})
export class TelegramModule {}