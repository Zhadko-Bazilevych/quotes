import { Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { KyselyService } from 'src/database/kysely.service';

@Injectable()
export class AuthFactory {
  private static authInstance: ReturnType<typeof betterAuth>;

  constructor(private readonly db: KyselyService) {
    AuthFactory.authInstance = betterAuth({
      database: db,
    });
  }

  static getAuth(): ReturnType<typeof betterAuth> {
    return AuthFactory.authInstance;
  }
}
