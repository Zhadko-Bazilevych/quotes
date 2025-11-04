import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthFactory } from 'src/auth/auth.provider';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';
import { toNodeHandler } from 'better-auth/node';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly authFactory: AuthFactory,
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
        AuthFactory,
        PostgresDialectService,
        { provide: APP_GUARD, useClass: AuthGuard },
      ],
      exports: [AuthFactory],
    };
  }
}
