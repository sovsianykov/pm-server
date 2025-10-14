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
import { Role } from '../roles/roles.model';

export interface JwtPayload {
  id: number;
  email: string;
  roles: Role[];
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const tokens = await this.generateTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
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
    const tokens = await this.generateTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens, message: 'user created successfully' };
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);

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

  private async saveRefreshToken(userId: number, refreshToken: string) {
    await this.userService.updateUser(userId, { refreshToken });
  }

  // private async getStoredRefreshToken(userId: number) {
  //   const user = await this.userService.getUserById(userId);
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  //   }
  //   return user.refreshToken;
  // }

  private async generateTokens(user: User) {
    const payload = { id: user.id, email: user.email, roles: user.roles };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.userService.getUserById(payload.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException({ message: 'Invalid refresh token' });
      }

      const tokens = await this.generateTokens(user);
      await this.userService.updateUser(user.id, {
        refreshToken: tokens.refreshToken,
      });

      return { user, ...tokens };
    } catch {
      throw new UnauthorizedException({
        message: 'Refresh token expired or invalid',
      });
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.userService.getUserById(payload.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException({ message: 'Invalid refresh token' });
      }

      await this.userService.updateUser(user.id, { refreshToken: null });
      return { message: 'Logged out successfully' };
    } catch {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
      });
    }
  }
}
