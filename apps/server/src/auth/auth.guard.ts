import { Request } from 'express';
import { AuthProvider } from 'src/auth/auth.provider';
import { AuthStore } from 'src/auth/auth-als.module';

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
    private readonly authFactory: AuthProvider,
    private readonly authStore: AuthStore,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = this.authStore.getStore();

    const isOptional = this.reflector.getAllAndOverride<boolean>('PUBLIC', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user || isOptional) {
      return true;
    }
    return false;
  }
}
