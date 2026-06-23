import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { AuthStore } from 'src/auth/auth-als.module';
import { KyselyService } from 'src/database/kysely.service';
import { QuoteId } from 'src/database/tables/quote.tables';
import { QuoteListQueryDto } from 'src/quote/dto/quote-list-query.dto';
import { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import { VoteQuoteDto } from 'src/quote/dto/vote.dto';
import { ParsingError, QuoteNotFoundError } from 'src/quote/quote.errors';
import {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteList,
  UpdateQuoteError,
  VoteQuoteError,
} from 'src/quote/quote.types';
import { ForbiddenError, MissingUserError } from 'src/utils/errors/app-errors';

import { Injectable } from '@nestjs/common';
import { createQlParser } from '@querylang/core';

import { Quote } from './domain/quote';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteRepository } from './infrastructure/persistence/repositiries/quote-repository.interface';

export const quoteSearchParser = createQlParser({
  author: { type: 'string', aliases: { a: true } },
  user: { type: 'string', aliases: { u: true } },
  content: { type: 'string', aliases: { ctn: true, cn: true } },
  context: { type: 'string', aliases: { ctx: true, cx: true } },
  likes: { type: 'number' },
  dislikes: { type: 'number' },
  liked: { type: 'boolean' },
  disliked: { type: 'boolean' },
  private: { type: 'boolean' },
});

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly authStore: AuthStore,
    private readonly db: KyselyService,
  ) {}

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    const { ability } = this.authStore.getStore();
    return this.quoteRepository.getOne(id).andThen((quote) => {
      if (!ability.can('read', quote)) {
        return errAsync(new QuoteNotFoundError({ id }));
      }

      return okAsync(quote);
    });
  }

  getList(
    quoteListQueryDto: QuoteListQueryDto,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    const { pagination, filter, sort } = quoteListQueryDto;

    const { user } = this.authStore.getStore();
    const { ast, errors } = quoteSearchParser.parse(filter?.q ?? '');

    if (errors.length) {
      return errAsync(new ParsingError({ errors }));
    }

    return this.quoteRepository.getList({
      pagination,
      sort,
      filtersAst: ast,
      userId: user?.id,
    });
  }

  createOwnQuote(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    const { ability, user } = this.authStore.getStore();
    if (!user) {
      throw new MissingUserError();
    }
    if (!ability.can('create', 'Quote')) {
      return errAsync(new ForbiddenError());
    }

    return this.quoteRepository.create(user.id, data);
  }

  update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    const { ability } = this.authStore.getStore();
    const canUpdateEveryField = Object.keys(data).every((k) =>
      ability.can('update', 'Quote', k),
    );
    if (!canUpdateEveryField) {
      return errAsync(new ForbiddenError());
    }

    return this.db.withTransaction(() =>
      this.quoteRepository.getOne(id).andThen((quote) => {
        if (!ability.can('update', quote)) {
          return errAsync(new ForbiddenError());
        }

        return this.quoteRepository.update(id, data);
      }),
    );
  }

  delete(id: QuoteId): ResultAsync<Quote, DeleteQuoteError> {
    const { ability } = this.authStore.getStore();
    return this.db.withTransaction(() =>
      this.quoteRepository.getOne(id).andThen((quote) => {
        if (!ability.can('delete', quote)) {
          return errAsync(new ForbiddenError());
        }

        return this.quoteRepository.delete(id);
      }),
    );
  }

  vote(
    id: QuoteId,
    { value }: VoteQuoteDto,
  ): ResultAsync<void, VoteQuoteError> {
    const { user } = this.authStore.getStore();
    if (!user) {
      throw new MissingUserError();
    }
    return this.db.withTransaction(() =>
      this.quoteRepository.getOne(id).andThen(() => {
        return this.quoteRepository.vote(id, user.id, value);
      }),
    );
  }
}
