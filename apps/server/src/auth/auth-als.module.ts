import { AsyncLocalStorage } from 'node:async_hooks';

import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { AuthProvider } from 'src/auth/auth.provider';
import { AppUser, AuthStoreType, Role } from 'src/auth/auth.types';
import { defineAbilityFor } from 'src/auth/permissions';
import { UserId } from 'src/database/tables/user.tables';

import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

export class AuthStore extends AsyncLocalStorage<AuthStoreType> {
  override getStore(): AuthStoreType {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return super.getStore()!;
  }
}

@Global()
@Module({
  providers: [
    {
      provide: AuthStore,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AuthStore],
})
export class AuthAlsModule implements NestModule {
  constructor(
    private readonly authStore: AuthStore,
    private readonly authFactory: AuthProvider,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const baseSession = await this.authFactory.client.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        const role = (baseSession?.user.role?.split(',') ?? []) as Role[];

        const user: AppUser | null = baseSession
          ? {
              ...baseSession.user,
              id: Number(baseSession.user.id) as UserId,
              role,
              __typename: 'User' as const,
            }
          : null;

        const ability = defineAbilityFor(user);

        this.authStore.run({ user, ability }, () => {
          next();
        });
      })
      .forRoutes('*path');
  }
}
