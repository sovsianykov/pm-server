import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { HttpException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return await this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '60m',
    });
    return {
      token: accessToken,
    };
  }

  private async validateUser(useDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(useDto.email);

    return user?.password;

    if (!user || !user.password) {
      throw new UnauthorizedException({ message: 'Invalid email or password' });
    }

    const passwordEqual = await bcrypt.compare(useDto.password, user.password);

    if (passwordEqual) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Invalid email or password' });
  }
}
