import { env } from '@/env';

import { QuoteApi } from './quote-api';

export class Api {
  readonly quotes: QuoteApi;

  constructor(baseUrl: string) {
    this.quotes = new QuoteApi(baseUrl);
  }
}

export function createApi(baseUrl: string): Api {
  return new Api(baseUrl);
}

export const api = createApi(env.VITE_API_BASE_URL);
