import { Request } from 'express';
import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { AuthFactory } from 'src/auth/auth.provider';
import { fromNodeHeaders } from 'better-auth/node';
import { Reflector } from '@nestjs/core';
import { getSession } from 'better-auth/api';

type UserSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

export interface SessionRequest extends Request {
  session?: UserSession;
}

export const OptionalAuth = (): CustomDecorator => SetMetadata('PUBLIC', true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authFactory: AuthFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const session = await this.authFactory.client.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    request.session = session ?? undefined;

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
