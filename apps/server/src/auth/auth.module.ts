import { toNodeHandler } from 'better-auth/node';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthProvider } from 'src/auth/auth.provider';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HttpAdapterHost } from '@nestjs/core';

@Module({})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly authFactory: AuthProvider,
  ) {}

  onModuleInit(): void {
    this.adapter.httpAdapter.all(
      `/api/auth/{*any}`,
      toNodeHandler(this.authFactory.client),
    );
  }

  static register(): DynamicModule {
    return {
      module: AuthModule,
      global: true,
      providers: [
        AuthProvider,
        PostgresDialectService,
        { provide: APP_GUARD, useClass: AuthGuard },
      ],
      exports: [AuthProvider],
    };
  }
}
