import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user-dto';
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
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
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

    return { accessToken };
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);

    console.log('user', user);
    console.log('userDto.password:', userDto.password);
    console.log('user.dataValues.password:', user?.dataValues.password);

    if (!user || !user.password) {
      throw new UnauthorizedException({ message: 'Invalid email or password' });
    }

    const passwordEqual = await bcrypt.compare(
      userDto.password,
      user.dataValues.password,
    );

    if (!passwordEqual) {
      throw new UnauthorizedException({ message: 'Invalid email or password' });
    }

    return user;
  }
}
