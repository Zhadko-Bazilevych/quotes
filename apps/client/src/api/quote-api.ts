import {
  type GetQuotesQuery,
  type Quote,
  type CreateQuoteData,
  type UpdateQuoteData,
  type QuoteDto,
  type QuoteListDto,
  type QuoteList,
} from '@/types';
import { BaseApi } from './base-api';
import { Client } from './client';
import { QuoteMapper } from '@/mappers/quote';

export class QuoteApi extends BaseApi {
  async getList(query?: GetQuotesQuery): Promise<QuoteList> {
    const url = this.buildUrl('quotes');
    const response = await Client.get<QuoteListDto>(url, { query });

    return {
      quotes: response.quotes.map((quote) => QuoteMapper.toDomain(quote)),
      totalPages: response.totalPages,
    };
  }

  async getOneById(id: number): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    const quote = await Client.get<QuoteDto>(url);
    return QuoteMapper.toDomain(quote);
  }

  async update(id: number, data: UpdateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    const quote = await Client.put<QuoteDto>(url, { body: data });
    return QuoteMapper.toDomain(quote);
  }

  async create(data: CreateQuoteData): Promise<Quote> {
    const url = this.buildUrl('quotes');
    const quote = await Client.post<QuoteDto>(url, { body: data });
    return QuoteMapper.toDomain(quote);
  }

  async delete(id: number): Promise<Quote> {
    const url = this.buildUrl('quotes', id);
    const quote = await Client.delete<QuoteDto>(url);
    return QuoteMapper.toDomain(quote);
  }
}
