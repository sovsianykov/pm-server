import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.service';
import { Request } from 'express';
import * as process from 'node:process';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request & { user?: JwtPayload } = context
      .switchToHttp()
      .getRequest();

    try {
      const authHeader: string | undefined = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'Authorization header missing.',
        });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User not authorized.' });
      }

      const user: JwtPayload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = user;

      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
      throw new UnauthorizedException({ message: 'User not authorized.' });
    }
  }
}
