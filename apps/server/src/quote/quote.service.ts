import { Injectable } from '@nestjs/common';
import { KyselyService } from 'src/database/kysely.service';
import {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteId,
  QuoteListResponse,
  UpdateQuoteError,
} from 'src/quote/quote.types';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { UnexpectedError } from 'src/utils/errors/app-errors';
import { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import { QuoteNotFoundError } from 'src/quote/quote.errors';
import { PaginationOptions } from 'src/utils/dto/pagination.dto';
import { getOffset, getTotalPages } from 'src/utils/query';
import { Quote } from './domain/quote';

@Injectable()
export class QuotesService {
  constructor(private readonly db: KyselyService) {}

  getOneById(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
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
    pageSize,
  }: PaginationOptions): ResultAsync<QuoteListResponse, GetQuoteListError> {
    return ResultAsync.fromPromise(
      this.db.transaction().execute(async (trx) => {
        const offset = getOffset(page, pageSize);

        const data = await trx
          .selectFrom('quote')
          .selectAll()
          .orderBy('id', 'desc')
          .offset(offset)
          .limit(pageSize)
          .execute();

        const { total } = await trx
          .selectFrom('quote')
          .select((eb) => eb.fn.countAll<number>().as('total'))
          .executeTakeFirstOrThrow();

        const totalPages = getTotalPages(total, pageSize);

        return {
          data,
          total,
          page,
          pageSize,
          totalPages,
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
    id: QuoteId,
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

  delete(id: QuoteId): ResultAsync<Quote, DeleteQuoteError> {
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
