import { QuoteApi } from './quote-api';

class Api {
  readonly quotes: QuoteApi;

  constructor(baseUrl: string) {
    this.quotes = new QuoteApi(baseUrl);
  }
}

export function createApi(baseUrl: string): Api {
  return new Api(baseUrl);
}

export const api = createApi('http://localhost:3000/');
