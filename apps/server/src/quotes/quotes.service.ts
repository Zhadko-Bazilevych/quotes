import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  Quote,
  QuoteListResponse,
  UpdateQuoteError,
} from 'src/quotes/quotes.types';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { UnexpectedError } from 'src/utils/errors/app-errors';
import { UpdateQuoteDto } from 'src/quotes/dto/update-quote.dto';
import { QuoteNotFoundError } from 'src/quotes/quotes.errors';
import { PaginationOptions } from 'src/utils/dto/pagination.dto';

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

  getList({
    page,
    size,
  }: PaginationOptions): ResultAsync<QuoteListResponse, GetQuoteListError> {
    return ResultAsync.fromPromise(
      this.db.transaction().execute(async (trx) => {
        const quotes = await trx
          .selectFrom('quote')
          .selectAll()
          .orderBy('id', 'desc')
          .offset((page - 1) * size)
          .limit(size)
          .execute();

        const [{ count }] = await trx
          .selectFrom('quote')
          .select((eb) => eb.fn.countAll<number>().as('count'))
          .execute();

        return {
          quotes,
          total: Math.ceil(count),
        };
      }),
      () => new UnexpectedError(),
    );
  }

  create(quote: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    return ResultAsync.fromPromise(
      this.db
        .insertInto('quote')
        .values({
          author: quote.author,
          content: quote.content,
          user: quote.user,
          context: quote.context,
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      () => new UnexpectedError(),
    );
  }

  update(
    id: number,
    quote: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    return ResultAsync.fromPromise(
      this.db
        .updateTable('quote')
        .set({
          author: quote.author,
          content: quote.content,
          user: quote.user,
          context: quote.context,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst(),
      () => new UnexpectedError(),
    ).andThen((quote): Result<Quote, QuoteNotFoundError> => {
      if (!quote) {
        return err(new QuoteNotFoundError({ id }));
      }

      return ok(quote);
    });
  }

  delete(id: number): ResultAsync<Quote, DeleteQuoteError> {
    return ResultAsync.fromPromise(
      this.db
        .deleteFrom('quote')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst(),
      () => new UnexpectedError(),
    ).andThen((quote): Result<Quote, QuoteNotFoundError> => {
      if (!quote) {
        return err(new QuoteNotFoundError({ id }));
      }

      return ok(quote);
    });
  }
}
