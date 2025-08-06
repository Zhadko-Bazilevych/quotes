import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import { Quote } from 'src/quotes/quotes.types';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { err, ok, Result, ResultAsync } from 'neverthrow';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function TaggedError<Tag extends string>(tag: Tag) {
  return class TE<Cause = void> extends Error {
    tag: Tag = tag;
    override cause: Cause;

    constructor(cause: Cause) {
      super();
      this.cause = cause;
      this.name = tag;
    }
  };
}

class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: number;
}> {}

class UnexpectedError extends TaggedError('UnexpectedError') {}

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;

@Injectable()
export class QuotesService {
  constructor(private readonly db: KyselyService) {}

  getOneById(id: number): ResultAsync<Quote, GetQuoteError> {
    return ResultAsync.fromPromise(
      this.db
        .selectFrom('quote')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst(),
      () => new UnexpectedError(),
    ).andThen((quote): Result<Quote, QuoteNotFoundError> => {
      if (!quote) {
        return err(new QuoteNotFoundError({ id }));
      }

      return ok(quote);
    });
  }

  async create(quote: CreateQuoteDto): Promise<Quote> {
    // TODO: use ResultAsync
    return this.db
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
