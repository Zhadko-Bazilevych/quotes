import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import { CompiledQuery } from 'kysely';
import { CreateQuoteDto, Quote } from 'src/quotes/quotes.types';

@Injectable()
export class QuotesService {
  constructor(private readonly db: KyselyService) {}

  async test() {
    const { rows } = await this.db.executeQuery<{ test: 1 }>(
      CompiledQuery.raw('select 1 as test', []),
    );

    return rows[0];
  }

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
