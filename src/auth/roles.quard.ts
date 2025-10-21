import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.service';
import { Request } from 'express';
import * as process from 'node:process';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request & { user?: JwtPayload } = context
      .switchToHttp()
      .getRequest();

    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }
      const authHeader: string | undefined = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Authorization header missing.',
        });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User not authorized. Message from guard',
        });
      }

      const user: JwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
