
import { Controller, Post, Body, Get, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/entities/dto/create-user.dto';
import { UserService } from 'src/logic/auth.service';

@Controller('api/registration')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { message: 'User created successfully', user };
  }
  @Get()
  async getUsers(@Res() res: Response) {
    const users = this.userService.getUsers(res);
    return { message: "Users:", users}
  }
}