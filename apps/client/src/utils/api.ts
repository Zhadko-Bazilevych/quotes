import type {
  GetQuotesQuery,
  Quote,
  CreateQuoteData,
  UpdateQuoteData,
} from '../types';
import { ApiClient } from './api-client';

class Api {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(...path: (string | number)[]): string {
    return this.baseUrl + path.join('/');
  }

  getQuotes(query?: GetQuotesQuery): Promise<Quote[]> {
    const url = this.buildUrl('quotes');
    return ApiClient.get(url, { query });
  }

  updateQuote(id: number, data: UpdateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    return ApiClient.put(url, { body: data });
  }

  createQuote(data: CreateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes');
    return ApiClient.post(url, { body: data });
  }

  deleteQuote(id: number): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    return ApiClient.delete(url);
  }
}

export const api = new Api('http://localhost:3000/');
