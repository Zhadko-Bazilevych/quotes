import { AuthApi } from '@/api/auth-api';
import { env } from '@/env';

import { QuoteApi } from './quote-api';

export class Api {
  readonly quotes: QuoteApi;
  readonly auth: AuthApi;

  constructor(baseUrl: string) {
    this.quotes = new QuoteApi(baseUrl);
    this.auth = new AuthApi();
  }
}

export function createApi(baseUrl: string): Api {
  return new Api(baseUrl);
}

export const api = createApi(env.VITE_API_BASE_URL);
