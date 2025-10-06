import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Injectable()
export class AuthFactory {
  private readonly betterAuthClient: ReturnType<typeof betterAuth>;

  constructor(dialect: PostgresDialectService) {
    this.betterAuthClient = betterAuth({
      database: dialect,
      emailAndPassword: {
        enabled: true,
      },
      // socialProviders: {
      //   google: {
      //     clientId: process.env.GOOGLE_CLIENT_ID as string,
      //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      //   },
      // },
      trustedOrigins: ['http://localhost:5173'],
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
