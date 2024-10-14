import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return !!request.header(REQUEST_USER_KEY);
  }
}
