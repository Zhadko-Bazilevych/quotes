import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { PostgresDialectService } from 'src/database/postgres-dialect.service';

@Injectable()
export class AuthFactory {
  static client: ReturnType<typeof betterAuth>;

  constructor(dialect: PostgresDialectService) {
    AuthFactory.client = betterAuth({
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
    });
  }
}
