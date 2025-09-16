import { err, ok, type Result, ResultAsync } from 'neverthrow';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import type {
  CreateQuoteError,
  QuoteId,
  GetQuoteError,
  UpdateQuoteError,
  QuoteList,
  GetQuoteListError,
  DeleteQuoteError,
} from 'src/quote/quote.types';
import type {
  GetQuoteListOptions,
  QuoteListFilter,
  QuoteRepository,
} from './quote-repository.interface';
import { Database, KyselyService } from 'src/database/kysely.service';
import { UnexpectedError } from 'src/utils/errors/app-errors';
import { QuoteNotFoundError } from 'src/quote/quote.errors';
import { getOffset, getTotalPages } from 'src/utils/query';
import { Injectable } from '@nestjs/common';
import { QuoteMapper } from 'src/quote/infrastructure/persistence/mappers/quote.mapper';
import { ExpressionWrapper, SqlBool } from 'kysely';
import { KeywordSearch } from 'src/parser';

@Injectable()
export class KyselyQuoteRepository implements QuoteRepository {
  constructor(private readonly db: KyselyService) {}

  create(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    const { author, content, user, context } = data;

    return ResultAsync.fromPromise(
      this.db
        .insertInto('quote')
        .values({
          author,
          content,
          user,
          context,
        })
        .returningAll()
        .executeTakeFirstOrThrow(),
      () => new UnexpectedError(),
    ).map((quote) => QuoteMapper.toDomain(quote));
  }

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    return ResultAsync.fromPromise(
      this.db
        .selectFrom('quote')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst(),
      () => new UnexpectedError(),
    )
      .andThen((quote): Result<Quote, QuoteNotFoundError> => {
        if (!quote) {
          return err(new QuoteNotFoundError({ id }));
        }

        return ok(quote);
      })
      .map((quote) => QuoteMapper.toDomain(quote));
  }

  update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    const { author, content, user, context } = data;

    return ResultAsync.fromPromise(
      this.db
        .updateTable('quote')
        .set({
          author,
          content,
          user,
          context,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst(),
      () => new UnexpectedError(),
    )
      .andThen((quote): Result<Quote, QuoteNotFoundError> => {
        if (!quote) {
          return err(new QuoteNotFoundError({ id }));
        }

        return ok(quote);
      })
      .map((quote) => QuoteMapper.toDomain(quote));
  }

  getList(
    options: GetQuoteListOptions,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    const {
      pagination: { page, pageSize },
      filter,
      sort = [{ field: 'id', order: 'desc' }],
    } = options;

    return ResultAsync.fromPromise(
      this.db.transaction().execute(async (trx) => {
        const offset = getOffset(page, pageSize);

        let baseQuery = trx.selectFrom('quote');
        if (filter) {
          baseQuery = baseQuery.where((eb) => {
            const expressions: ExpressionWrapper<Database, 'quote', SqlBool>[] =
              [];
            for (const [key, values] of Object.entries(filter) as [
              keyof QuoteListFilter,
              KeywordSearch[],
            ][]) {
              if (!values.length) {
                continue;
              }
              if (key === 'common') {
                expressions.push(
                  eb.and(
                    values.map((value) => {
                      const op = value.include
                        ? ('ilike' as const)
                        : ('not ilike' as const);
                      const expr = [
                        eb('user', op, `%${value.value}%`),
                        eb('author', op, `%${value.value}%`),
                        eb('content', op, `%${value.value}%`),
                        eb('context', op, `%${value.value}%`),
                      ];
                      if (value.include) {
                        return eb.or(expr);
                      }
                      return eb.and(expr);
                    }),
                  ),
                );
                continue;
              }

              expressions.push(
                eb.or(
                  values.map((value) =>
                    eb(
                      key,
                      value.include
                        ? ('ilike' as const)
                        : ('not ilike' as const),
                      `%${value.value}%`,
                    ),
                  ),
                ),
              );
            }

            return eb.and(expressions);
          });
        }

        for (const sorter of sort) {
          baseQuery = baseQuery.orderBy(sorter.field, sorter.order);
        }

        const data = await baseQuery
          .selectAll()
          .offset(offset)
          .limit(pageSize)
          .execute();

        const { total } = await baseQuery
          .clearOrderBy()
          .select((eb) => eb.fn.countAll<number>().as('total'))
          .executeTakeFirstOrThrow();

        return {
          data,
          total,
        };
      }),
      () => new UnexpectedError(),
    ).map(({ data, total }) => {
      const totalPages = getTotalPages(total, pageSize);

      return {
        data: data.map((quote) => QuoteMapper.toDomain(quote)),
        total,
        page,
        pageSize,
        totalPages,
      };
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
    )
      .andThen((quote): Result<Quote, QuoteNotFoundError> => {
        if (!quote) {
          return err(new QuoteNotFoundError({ id }));
        }

        return ok(quote);
      })
      .map((quote) => QuoteMapper.toDomain(quote));
  }
}
