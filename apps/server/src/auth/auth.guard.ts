import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';
import { AuthFactory } from 'src/auth/auth.provider';

import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const OptionalAuth = (): CustomDecorator => SetMetadata('PUBLIC', true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authFactory: AuthFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const session = await this.authFactory.client.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    request.session = session;

    const isOptional = this.reflector.getAllAndOverride<boolean>('PUBLIC', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (session || isOptional) {
      return true;
    }
    return false;
  }
}
