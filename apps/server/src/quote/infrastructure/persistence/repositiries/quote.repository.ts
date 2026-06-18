import { ExpressionBuilder, ExpressionWrapper, sql, SqlBool } from 'kysely';
import { CompiledQuery } from 'kysely';
import { err, ok, okAsync, type Result, ResultAsync } from 'neverthrow';
import { AuthStore } from 'src/auth/auth-als.module';
import { kyselyWhere } from 'src/auth/permissions';
import { Database, KyselyService } from 'src/database/kysely.service';
import type { QuoteId } from 'src/database/tables/quote.tables';
import { UserId } from 'src/database/tables/user.tables';
import { VoteQuoteValue } from 'src/database/tables/vote.table';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import { QuoteListSortDto } from 'src/quote/dto/quote-list-query.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import { QuoteEntity } from 'src/quote/infrastructure/persistence/entities/quote.entity';
import { QuoteMapper } from 'src/quote/infrastructure/persistence/mappers/quote.mapper';
import { QuoteNotFoundError } from 'src/quote/quote.errors';
import type {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteList,
  UpdateQuoteError,
  VoteQuoteError,
} from 'src/quote/quote.types';
import { dbTry } from 'src/utils/db';
import { getOffset, getTotalPages } from 'src/utils/query';

import { Injectable } from '@nestjs/common';
import { createQlParser, toSql } from '@querylang/core';

import type {
  GetQuoteListOptions,
  QuoteRepository,
} from './quote-repository.interface';

const sortAliases: Record<
  Exclude<QuoteListSortDto, undefined>[number]['field'],
  string
> = {
  id: '"id"',
  createdAt: '"created_at"',
  updatedAt: '"updated_at"',
  'user.name': '"user"."name"',
  author: '"author"',
};

@Injectable()
export class KyselyQuoteRepository implements QuoteRepository {
  constructor(
    private readonly db: KyselyService,
    private readonly authStore: AuthStore,
  ) {}

  create(
    userId: UserId,
    data: CreateQuoteDto,
  ): ResultAsync<Quote, CreateQuoteError> {
    const { author, content, context, visibility } = data;

    return this.db
      .withTransaction(() => {
        return okAsync(userId).andThen((userId) =>
          dbTry(
            this.db.ctx
              .insertInto('quote')
              .values({
                author,
                content,
                userId,
                context,
                visibility,
              })
              .returningAll()
              .executeTakeFirstOrThrow(),
          ),
        );
      })
      .map((quote) => QuoteMapper.entityToDomain(quote));
  }

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    return dbTry(
      this.db.ctx
        .selectFrom('quote')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst(),
    )
      .andThen((quote): Result<QuoteEntity, QuoteNotFoundError> => {
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
    const { author, content, userId, context, visibility } = data;

    return this.db
      .withTransaction(() => {
        return okAsync(userId).andThen((userId) =>
          dbTry(
            this.db.ctx
              .updateTable('quote')
              .set({
                author,
                content,
                userId,
                context,
                visibility,
                updatedAt: new Date(),
              })
              .where('id', '=', id)
              .returningAll()
              .executeTakeFirst(),
          ),
        );
      })
      .andThen((quote) => {
        if (!quote) {
          return err(new QuoteNotFoundError({ id }));
        }

        return ok(quote);
      })
      .map((quote) => QuoteMapper.entityToDomain(quote));
  }

  getList(
    options: GetQuoteListOptions,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    const {
      pagination: { page, pageSize },
      q = '',
      sort = [{ field: 'id', order: 'desc' }],
      userId,
    } = options;

    const parser = createQlParser({
      author: { type: 'string', aliases: { a: true } },
      user: { type: 'string', aliases: { u: true } },
      content: { type: 'string', aliases: { cnt: true, cn: true } },
      context: { type: 'string', aliases: { ctx: true, cx: true } },
      likes: { type: 'number' },
      dislikes: { type: 'number' },
      is_liked: { type: 'boolean' },
      is_private: { type: 'boolean' },
    });

    return this.db
      .withTransaction(() => {
        const offset = getOffset(page, pageSize);

        const { ability } = this.authStore.getStore();
        const permissions = kyselyWhere(ability, 'read', 'Quote');

        let baseQuery = this.db.ctx
          .selectFrom('quote')
          .innerJoin('user', 'user.id', 'quote.userId')
          .$if(!!userId, (qb) =>
            qb.leftJoin('vote', (join) =>
              join
                .onRef('vote.quoteId', '=', 'quote.id')
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                .on('vote.userId', '=', userId!),
            ),
          )
          .where(permissions);

        const compiledQuery = baseQuery.compile();

        const filters = toSql(parser.parse(q).ast, {
          parameterOffset: compiledQuery.parameters.length,
        });

        baseQuery = baseQuery.where(sql.raw<boolean>(filters.sql));

        const quotesQuery = baseQuery
          .select([
            'quote.id',
            'author',
            'quote.userId',
            'user.name',
            'content',
            'context',
            'quote.createdAt',
            'quote.updatedAt',
            'likes',
            'dislikes',
            'visibility',
          ])
          .$if(!!userId, (qb) =>
            qb.select(sql<VoteQuoteValue>`vote.value`.as('vote')),
          );

        const totalQuery = baseQuery.select((eb) =>
          eb.fn.countAll<number>().as('total'),
        );

        const compiledQuotesQuery = quotesQuery.compile();
        const compiledTotalQuery = totalQuery.compile();

        const sortSql = sort
          .map(({ field, order }) => `${sortAliases[field]} ${order}`)
          .join(', ');
        console.log(sortSql);

        const rawQuotesSql = `${compiledQuotesQuery.sql} order by ${sortSql} limit ${pageSize} offset ${offset}`;

        const sqlParameters = [
          ...compiledQuery.parameters,
          ...filters.parameters,
        ];

        const quotesRawQuery = CompiledQuery.raw(rawQuotesSql, sqlParameters);
        const totalRawQuery = CompiledQuery.raw(
          compiledTotalQuery.sql,
          sqlParameters,
        );

        console.log(totalRawQuery.sql);

        return ResultAsync.combine([
          dbTry(
            this.db.ctx
              .executeQuery(quotesRawQuery)
              .then((a) => a.rows) as ReturnType<typeof quotesQuery.execute>,
          ),
          dbTry(
            this.db.ctx
              .executeQuery(totalRawQuery)
              .then((a) => a.rows[0]) as Promise<number>,
          ),
        ]);
      })
      .map(([data, total]) => {
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
    return dbTry(
      this.db.ctx
        .deleteFrom('quote')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst(),
    )
      .andThen((quote): Result<QuoteEntity, QuoteNotFoundError> => {
        if (!quote) {
          return err(new QuoteNotFoundError({ id }));
        }
        return ok(quote);
      })
      .map((quote) => QuoteMapper.entityToDomain(quote));
  }

  vote(
    quoteId: QuoteId,
    userId: UserId,
    value: VoteQuoteValue,
  ): ResultAsync<void, VoteQuoteError> {
    return this.db.withTransaction(() =>
      dbTry(
        this.db.ctx
          .selectFrom('vote')
          .select('value')
          .where('quoteId', '=', quoteId)
          .where('userId', '=', userId)
          .executeTakeFirst(),
      )
        .andThen((vote) => {
          if (!vote) {
            return dbTry(
              this.db.ctx
                .insertInto('vote')
                .values({ quoteId, userId, value })
                .execute(),
            );
          }

          if (vote.value !== value) {
            return dbTry(
              this.db.ctx
                .updateTable('vote')
                .set({ value })
                .where('quoteId', '=', quoteId)
                .where('userId', '=', userId)
                .execute(),
            );
          }

          return dbTry(
            this.db.ctx
              .deleteFrom('vote')
              .where('quoteId', '=', quoteId)
              .where('userId', '=', userId)
              .execute(),
          );
        })
        .andThen(() => {
          return dbTry(
            this.db.ctx
              .selectFrom('vote')
              .select(({ fn }) => [
                'value',
                fn.count<number>('value').as('count'),
              ])
              .where('quoteId', '=', quoteId)
              .groupBy('value')
              .execute(),
          );
        })
        .andThen((votes) => {
          const likes = votes.find((row) => row.value === 1)?.count ?? 0;
          const dislikes = votes.find((row) => row.value === -1)?.count ?? 0;

          return dbTry(
            this.db.ctx
              .updateTable('quote')
              .set({ likes, dislikes })
              .where('id', '=', quoteId)
              .execute(),
          );
        })
        .andThen(() => ok()),
    );
  }
}
