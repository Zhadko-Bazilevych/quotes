import { AuthApi } from '@/api/auth-api';
import { UserApi } from '@/api/user-api';
import { env } from '@/env';

import { QuoteApi } from './quote-api';

export class Api {
  readonly quotes: QuoteApi;
  readonly auth: AuthApi;
  readonly users: UserApi;

  constructor(baseUrl: string) {
    this.quotes = new QuoteApi(baseUrl);
    this.auth = new AuthApi();
    this.users = new UserApi(baseUrl);
  }
}

export function createApi(baseUrl: string): Api {
  return new Api(baseUrl);
}

export const api = createApi(env.VITE_API_BASE_URL);
