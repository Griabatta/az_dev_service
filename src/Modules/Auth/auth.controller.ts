
import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { extractSheetId } from 'src/tools/parse';
import { UserService } from './auth.service';
import { CreateUserDto } from './models/create-user.dto';

@Controller('api/registration')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { message: user };
  }
  @Get()
  async getUsers(id: number) {
    const users = this.userService.getDecryptedUserSecrets(id);
    return { message: "Users:", users}
  }
  @Get('/newId')
  async getTableId(@Req() req: Request) {

    let id = req.body.url;
    let result: string | null = "";
    if (typeof id === "string")
    {
      result = extractSheetId(id);
    } else {
      result = "none";
    };
    return result;
  }
}