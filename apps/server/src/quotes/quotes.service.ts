import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import { CreateQuoteDto, Quote } from 'src/quotes/quotes.types';

@Injectable()
export class QuotesService {
  constructor(private readonly db: KyselyService) {}

  async getQuoteById(id: number): Promise<Quote> {
    return await this.db
      .selectFrom('quote')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async createQuote(quote: CreateQuoteDto): Promise<Quote> {
    return await this.db
      .insertInto('quote')
      .values({
        author: quote.author,
        content: quote.content,
        user: quote.user,
        context: quote.content,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
