import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { DocumentBuilder } from '@nestjs/swagger';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.clearUser(userDto);
  }

  @Get()
  getAll() {
    return this.userService.getUsers();
  }
}
