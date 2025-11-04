import { err, ok, type Result, ResultAsync } from 'neverthrow';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import type {
  CreateQuoteError,
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
import { ExpressionWrapper, sql, SqlBool, Transaction } from 'kysely';
import type { QuoteId } from 'src/database/tables/quote.tables';
import { UserId } from 'src/database/tables/user.tables';

@Injectable()
export class KyselyQuoteRepository implements QuoteRepository {
  constructor(private readonly db: KyselyService) {}

  private async getOrCreateUserByName(
    name: string,
    trx?: Transaction<Database>,
  ): Promise<UserId> {
    const db = trx ?? this.db;

    const user = await db
      .selectFrom('user')
      .select('id')
      .where('name', '=', name)
      .executeTakeFirst();

    if (user) {
      return user.id;
    }
    const inserted = await db
      .insertInto('user')
      .values({
        name,
        email: sql`gen_random_uuid() || '@example.com'`,
        emailVerified: false,
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    return inserted.id;
  }

  create(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    const { author, content, user, context } = data;
    return ResultAsync.fromPromise(
      this.db.transaction().execute(async (trx) => {
        const userId = await this.getOrCreateUserByName(user, trx);

        return trx
          .insertInto('quote')
          .values({
            author,
            content,
            userId,
            context,
          })
          .returningAll()
          .executeTakeFirstOrThrow();
      }),
      () => new UnexpectedError(),
    ).map((quote) => QuoteMapper.entityToDomain(quote));
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
      .map((quote) => QuoteMapper.entityToDomain(quote));
  }

  update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    const { author, content, user, context } = data;

    return ResultAsync.fromPromise(
      this.db.transaction().execute(async (trx) => {
        let userId: UserId | undefined;
        if (user) {
          userId = await this.getOrCreateUserByName(user, trx);
        }

        const quote = await trx
          .updateTable('quote')
          .set({
            author,
            content,
            userId,
            context,
            updatedAt: new Date(),
          })
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirst();
        return quote;
      }),
      () => new UnexpectedError(),
    ).andThen((quote) => {
      if (!quote) {
        return err(new QuoteNotFoundError({ id }));
      }
      return ok(quote);
    });
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

        let baseQuery = trx
          .selectFrom('quote')
          .innerJoin('user', 'user.id', 'quote.userId');
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
              for (const value of exclude) {
                expressions.push(eb(key, 'not ilike', `%${value}%`));
              }
              const includeExpressions: BoolExpression[] = [];
              for (const value of include) {
                includeExpressions.push(eb(key, 'ilike', `%${value}%`));
              }
              if (includeExpressions.length) {
                expressions.push(eb.or(includeExpressions));
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

        for (const { field, order } of sort) {
          baseQuery = baseQuery.orderBy(field, order);
        }
        const data = await baseQuery
          .select([
            'quote.id',
            'author',
            'userId',
            'user.name',
            'content',
            'context',
            'quote.createdAt',
            'quote.updatedAt',
          ])
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
        data: data.map((quote) => QuoteMapper.entityAggregateToDomain(quote)),
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
      .map((quote) => QuoteMapper.entityToDomain(quote));
  }
}
