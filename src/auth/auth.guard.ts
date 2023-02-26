import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const urlBase = request.url.split('/')[1];

    if (['', 'auth', 'doc', 'test'].includes(urlBase)) return true;

    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException('no authorization header');

    const parsedAuthHeader = authHeader.split(' ');

    if (parsedAuthHeader.length !== 2 || parsedAuthHeader[0] !== 'Bearer') {
      throw new UnauthorizedException('authorization header does not match Bearer scheme');
    }

    try {
      jwt.verify(parsedAuthHeader[1], process.env.JWT_SECRET_KEY);
      return true;
    } catch {
      throw new UnauthorizedException('access token has expired');
    }
  }
}
