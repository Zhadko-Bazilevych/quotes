import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { Config } from 'src/config/config.types';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Injectable()
export class AuthFactory {
  private readonly betterAuthClient: ReturnType<typeof betterAuth>;

  constructor(
    config: ConfigService<Config, true>,
    dialect: PostgresDialectService,
  ) {
    this.betterAuthClient = betterAuth({
      database: dialect,
      emailAndPassword: {
        enabled: true,
      },
      advanced: {
        database: {
          generateId: false,
        },
      },
      baseURL: config.get('auth.betterAuthUrl', { infer: true }),
      trustedOrigins: config.get('app.cors', { infer: true }),
      secret: config.get('auth.betterAuthSecret', { infer: true }),
      user: {
        modelName: 'user',
        fields: {
          emailVerified: 'email_verified',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
      session: {
        modelName: 'session',
        fields: {
          expiresAt: 'expires_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          ipAddress: 'ip_address',
          userAgent: 'user_agent',
          userId: 'user_id',
        },
      },
      account: {
        modelName: 'account',
        fields: {
          accountId: 'account_id',
          providerId: 'provider_id',
          userId: 'user_id',
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          idToken: 'id_token',
          accessTokenExpiresAt: 'access_token_expires_at',
          refreshTokenExpiresAt: 'refresh_token_expires_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
      verification: {
        modelName: 'verification',
        fields: {
          expiresAt: 'expires_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
    });
  }

  get client(): ReturnType<typeof betterAuth> {
    return this.betterAuthClient;
  }
}
