import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller('/api/users')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
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
}
