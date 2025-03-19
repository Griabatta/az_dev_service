
import { Controller, Post, Body } from '@nestjs/common';
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
}