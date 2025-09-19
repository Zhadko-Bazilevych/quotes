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
    type BoolExpression = ExpressionWrapper<Database, 'quote', SqlBool>;
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
          const { common, ...restFilters } = filter;
          const keys = Object.keys(restFilters) as Exclude<
            keyof QuoteListFilter,
            'common'
          >[];
          baseQuery = baseQuery.where((eb) => {
            const expressions: BoolExpression[] = [];
            for (const key of keys) {
              const { include, exclude } = restFilters[key];
              for (const value of include) {
                expressions.push(eb(key, 'ilike', `%${value}%`));
              }
              const excludeExpressions: BoolExpression[] = [];
              for (const value of exclude) {
                excludeExpressions.push(eb(key, 'not ilike', `%${value}%`));
              }
              if (excludeExpressions.length) {
                expressions.push(eb.or(excludeExpressions));
              }
            }
            const { include, exclude } = common;
            for (const key of keys) {
              for (const value of exclude) {
                expressions.push(eb(key, 'not ilike', `%${value}%`));
              }
            }
            for (const value of include) {
              const includeExpressions: BoolExpression[] = [];
              for (const key of keys) {
                includeExpressions.push(eb(key, 'ilike', `%${value}%`));
              }
              expressions.push(eb.or(includeExpressions));
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
