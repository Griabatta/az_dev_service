// src/telegram/registration-bot.service.ts
import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import path from 'path';
import * as fs from 'fs';

interface RegistrationSession {
  step: string;
  data: {
    name?: string;
    email?: string;
    clientId?: string;
    apiKey?: string;
    clientPerFormanceId?: string;
    clientSecret?: string;
    tableSheetId?: string;
    mpStatToken?: string;
  };
}

@Injectable()
export class RegistrationBotService {
  private bot: TelegramBot;
  private sessions: Map<string, RegistrationSession> = new Map();
  private readonly tokenTGBot = process.env.TG_TOKEN || "7958171770:AAEbKZaTkYIUWxruNQ1N_ia2U_akREcVgD8";
  constructor() {
    this.validateToken();
    this.bot = new TelegramBot(this.tokenTGBot, { polling: true });
    this.setupHandlers();
  }

  private validateToken() {
    if (!this.tokenTGBot) {
      throw new Error('Telegram Bot Token not provided in .env file!');
    }
    
  }

  // private async sendInstructionImage(chatId: number) {
  //   try {
  //     // Правильный путь к изображению
  //     const imagePath = path.resolve(__dirname, '../../../assets/table-sheet-instruction.png');
      
  //     console.log('Looking for image at:', imagePath); // Для отладки
  
  //     if (!fs.existsSync(imagePath)) {
  //       throw new Error(`Файл не найден по пути: ${imagePath}`);
  //     }
  
  //     // Отправляем фото
  //     await this.bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
  //       caption: 'Инструкция по получению Table Sheet ID'
  //     });
  
  //   } catch (error) {
  //     console.error('Ошибка отправки изображения:', error);
  //     await this.bot.sendMessage(
  //       chatId,
  //       '📌 Введите ID таблицы из URL:\n' +
  //       '1. Откройте Google таблицу\n' +
  //       '2. Скопируйте часть между "/d/" и "/edit"\n' +
  //       'Пример: для ".../d/ABC123/edit" введите: ABC123'
  //     );
  //   }
  // }


  private setupHandlers() {
    // Команда /start
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id.toString();
      
      this.sessions.set(chatId, {
        step: 'name',
        data: {},
      });

      this.bot.sendMessage(
        chatId,
        'Добро пожаловать в регистрацию! Введите ваше имя:'
      );
    });

    this.bot.onText(/\/cancel/, (msg) => {
        const chatId = msg.chat.id.toString();
        this.sessions.delete(chatId);
        this.bot.sendMessage(chatId, 'Регистрация отменена. Чтобы начать заново - /start');
      });

    // Обработка сообщений
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id.toString();
      const text = msg.text;
      const session = this.sessions.get(chatId);

      if (!session || msg.text?.startsWith('/')) return;

      // Обработка шагов
      switch (session.step) {
        case 'name':
          session.data.name = text;
          session.step = 'email';
          this.bot.sendMessage(chatId, 'Введите ваш email:');
          break;

        case 'email':
          session.data.email = text;
          session.step = 'clientId';
          this.bot.sendMessage(chatId, 'Введите Client ID:');
          break;

        case 'clientId':
          session.data.clientId = text;
          session.step = 'apiKey';
          this.bot.sendMessage(chatId, 'Введите API Key:');
          break;

        case 'apiKey':
          session.data.apiKey = text;
          session.step = 'clientPerforId';
          this.bot.sendMessage(chatId, 'Введите Client Performance ID:');
          break;

        case 'clientPerforId':
          session.data.clientPerFormanceId = text;
          session.step = 'clientSecret';
          this.bot.sendMessage(chatId, 'Введите Client Secret:');
          break;

        case 'clientSecret':
          session.data.clientSecret = text;
          session.step = 'tableSheetId';
          this.bot.sendMessage(
            chatId,
            '📌 Введите ID таблицы из URL:\n' +
            '1. Откройте Google таблицу\n' +
            '2. Скопируйте часть между "/d/" и "/edit"\n' +
            'Пример: для ".../d/ABC123/edit" введите: ABC123'
          );
          // const imagePath = path.join(__dirname, 'assets/table-sheet-instruction.png');
          
          // const stream = fs.createReadStream(imagePath);
          // this.bot.sendPhoto(chatId, stream, {
          //   caption: 'Введите ID Google таблицы (из URL):\nПример: ABC123xyz'
          // });
          break;

        case 'tableSheetId':
          session.data.tableSheetId = text;
          session.step = 'mpStatToken';
          this.bot.sendMessage(
            chatId,
            'Введите MP Stat Token (если нет, отправьте "-"):'
          );
          break;

        case 'mpStatToken':
          if (text !== '-') session.data.mpStatToken = text;
          await this.sendRegistrationRequest(chatId, session.data);
          break;
      }

      this.sessions.set(chatId, session);
    });
  }

  private async sendRegistrationRequest(chatId: string, data: any) {
    try {
      // Формируем тело запроса
      const requestBody = {
        ...data,
        tgId: chatId
      };
      

      // Отправляем запрос
      const response = await axios.post(
        'http://localhost:3000/api/registration/',
        requestBody
      );

      if (response.status === 201) {
        this.bot.sendMessage(
          chatId,
          '✅ Регистрация успешно завершена! Спасибо!'
        );
      } else {
        throw new Error(`HTTP status ${response.status}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.bot.sendMessage(
        chatId,
        '❌ Ошибка регистрации. Пожалуйста, попробуйте позже или обратитесь в поддержку.'
      );
    } finally {
      this.sessions.delete(chatId); // Очищаем сессию
    }
  }

  
}