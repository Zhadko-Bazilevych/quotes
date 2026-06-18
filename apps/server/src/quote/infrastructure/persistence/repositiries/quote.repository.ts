import { sql } from 'kysely';
import { CompiledQuery } from 'kysely';
import { err, ok, okAsync, type Result, ResultAsync } from 'neverthrow';
import { AuthStore } from 'src/auth/auth-als.module';
import { kyselyWhere } from 'src/auth/permissions';
import { KyselyService } from 'src/database/kysely.service';
import type { QuoteId } from 'src/database/tables/quote.tables';
import { UserId } from 'src/database/tables/user.tables';
import { VoteQuoteValue } from 'src/database/tables/vote.table';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import { QuoteListSortDto } from 'src/quote/dto/quote-list-query.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import { QuoteEntity } from 'src/quote/infrastructure/persistence/entities/quote.entity';
import type { QuoteAggregateEntity } from 'src/quote/infrastructure/persistence/entities/quote-read.entity';
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
import { toSql } from '@querylang/core';

import type {
  GetQuoteListOptions,
  QuoteRepository,
} from './quote-repository.interface';

const sortAliases: Record<
  Exclude<QuoteListSortDto, undefined>[number]['field'],
  string
> = {
  id: '"id"',
  createdAt: '"sq"."created_at"',
  updatedAt: '"sq"."updated_at"',
  'user.name': '"sq"."name"',
  author: '"sq"."author"',
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
      filtersAst,
      sort = [{ field: 'id', order: 'desc' }],
      userId,
    } = options;

    return this.db
      .withTransaction(() => {
        const offset = getOffset(page, pageSize);

        const { ability } = this.authStore.getStore();
        const permissions = kyselyWhere(ability, 'read', 'Quote');

        let baseQuery = this.db.ctx.selectFrom((eb) =>
          eb
            .selectFrom('quote')
            .innerJoin('user', 'user.id', 'quote.userId')
            .leftJoin('vote', (join) =>
              join
                .onRef('vote.quoteId', '=', 'quote.id')
                .on('vote.userId', '=', userId ?? (-1 as UserId)),
            )
            .select((eb) => [
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
              'vote.value as vote',
              eb('visibility', '=', 'private').as('is_private'),
              eb.fn
                .coalesce(eb('vote.value', '=', 1), sql.lit(false))
                .as('is_liked'),
            ])
            .where(permissions)
            .as('sq'),
        );

        const compiledQuery = baseQuery.compile();

        const filters = toSql(filtersAst, {
          parameterOffset: compiledQuery.parameters.length,
          fieldOverrides: {
            user: '"sq"."name"',
          },
        });

        baseQuery = baseQuery.where(sql.raw<boolean>(filters.sql));

        const quotesQuery = baseQuery.selectAll();

        const totalQuery = baseQuery.select((eb) => [
          eb.fn.countAll<number>().as('total'),
        ]);

        const compiledQuotesQuery = quotesQuery.compile();
        const compiledTotalQuery = totalQuery.compile();

        const sortSql = sort
          .map(({ field, order }) => `${sortAliases[field]} ${order}`)
          .join(', ');

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
        console.log(quotesRawQuery.sql);
        console.log(quotesRawQuery.parameters);

        return ResultAsync.combine([
          dbTry(this.db.ctx.executeQuery<QuoteAggregateEntity>(quotesRawQuery)),
          dbTry(this.db.ctx.executeQuery<{ total: number }>(totalRawQuery)),
        ]);
      })
      .map(([dataResult, totalResult]) => ({
        data: dataResult.rows,
        total: totalResult.rows[0].total,
      }))
      .map(({ data, total }) => {
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
