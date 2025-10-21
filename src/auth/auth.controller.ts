import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import { LoginUserDto } from '../user/dto/login-user-dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('/api/users')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Post('/update')
  update(@Body() updateUserDto: UpdateUserDto) {

  }

  @Post('/refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }


  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.authService.deleteUser(id);
  }
}
