import { Injectable, Logger } from "@nestjs/common";
import { isAfter, startOfDay } from 'date-fns';
import { TokenRepo } from "./repository/token.repository";
import axios from "axios";
import { UserRep } from "src/Modules/Auth/repository/user.repository";
import { decrypt } from "src/tools/data.crypt";

@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name)
    constructor(
      private readonly tokenRepo: TokenRepo,

      private readonly user: UserRep,

      
    ) {}
    apiUrl = "https://api-performance.ozon.ru:443/api/client";

    async createToken(params) {
        const {accountId, clientPerForId, clientSecret} = params;
        // this.logger.debug(params.userId)
        const url = this.apiUrl + "/token";
        
        const headers = {
          'Content-Type': "application/json",
          'Accept': 'application/json'
        }
        
        const body = {
          client_id: clientPerForId,
          client_secret: clientSecret, 
          grant_type: 'client_credentials',
        };
    
        try {
    
          const response = await axios.post(url, body, { headers: headers });
    
          const { access_token } = response.data;
          const token = await this.tokenRepo.getTokenByUserId(Number(accountId));
          if (token?.token) {
            await this.tokenRepo.updateToken(access_token, Number(accountId));
          } else {
            await this.tokenRepo.createToken(
              {
                accountId: Number(accountId), 
                updatedAt: new Date(new Date().setHours(0,0,0,0)), 
                token: access_token,
                createdAt: new Date(new Date().setHours(0,0,0,0))
              }
            );
          }
          
    
          return access_token;

        } catch (error) {
          this.logger.error(error.message)
          Logger.log('Failed to get Ozon access token');
        }
    }

    async updateTokens() {
      try {
        const users = await this.user.getAllUser();
        
        if (!users || users.length === 0) {
          this.logger.warn('No users found for token update');
          return;
        }

        const url = this.apiUrl + "/token";
        const headers = {
          'Content-Type': "application/json",
          'Accept': 'application/json'
        };

        // Обрабатываем пользователей параллельно
        await Promise.all(users.map(async user => {
          try {
            
            if (!user.clientPerforId || !user.clientSecret) {
              this.logger.warn(`User ${user.id} missing credentials`);
              return;
            }

            this.logger.debug(`Updating token for user ${user.id}`);
            const cliendId = await decrypt(user.clientPerforId);
            const clientSecret = await decrypt(user.clientSecret);
            const body = {
              client_id: cliendId,
              client_secret: clientSecret, 
              grant_type: 'client_credentials',
            };

            const response = await axios.post(url, body, { headers });
            const { access_token } = response.data;
            const isToken = await this.tokenRepo.getTokenByUserId(user.id);
            if (!isToken?.token) {
              const tokendata = {
                token: access_token,
                userId: user.id,
                createdAt: startOfDay(new Date()),
                updatedAt: startOfDay(new Date())
                }
              await this.tokenRepo.createToken(tokendata);
              this.logger.log(`Token created for user ${user.id}`);
            } else {
              await this.tokenRepo.updateToken(access_token, user.id);
            }
            
          } catch (error) {
            this.logger.error(`Failed to update token for user ${user.id}: ${error.message}`);
          }
        }));

      } catch (error) {
        this.logger.error(`Token update failed: ${error.message}`);

      }
    }
};