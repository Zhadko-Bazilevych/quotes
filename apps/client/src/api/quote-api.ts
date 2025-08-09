import type {
  GetQuotesQuery,
  Quote,
  CreateQuoteData,
  UpdateQuoteData,
} from '@/types';
import { BaseApi } from './base-api';
import { Client } from './client';

export class QuoteApi extends BaseApi {
  getList(query?: GetQuotesQuery): Promise<Quote[]> {
    const url = this.buildUrl('quotes');
    return Client.get(url, { query });
  }

  getOneById(id: number): Promise<Quote[]> {
    const url = this.buildUrl('quotes', id);
    return Client.get(url);
  }

  update(id: number, data: UpdateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    return Client.put(url, { body: data });
  }

  create(data: CreateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes');
    return Client.post(url, { body: data });
  }

  delete(id: number): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    return Client.delete(url);
  }
}
