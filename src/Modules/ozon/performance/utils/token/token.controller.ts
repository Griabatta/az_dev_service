import { Controller } from "@nestjs/common";
import { TokenService } from "./token.service";

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService
  ) {}
  async token(params) {
    return this.tokenService.createToken(params)
  }

  async updateTokenAllUser() {
    return this.tokenService.updateTokens();
  }


}