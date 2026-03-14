import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { AuthStore } from 'src/auth/auth-als.module';
import { KyselyService } from 'src/database/kysely.service';
import { QuoteId } from 'src/database/tables/quote.tables';
import { QuoteListQueryDto } from 'src/quote/dto/quote-list-query.dto';
import { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteList,
  QuoteSearchQueryService,
  UpdateQuoteError,
} from 'src/quote/quote.types';
import { ForbiddenError, MissingUserError } from 'src/utils/errors/app-errors';

import { Inject, Injectable } from '@nestjs/common';

import { Quote } from './domain/quote';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteRepository } from './infrastructure/persistence/repositiries/quote-repository.interface';
import { QUOTE_SEARCH_QUERY_SERVICE } from './quote.constants';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    @Inject(QUOTE_SEARCH_QUERY_SERVICE)
    private readonly quoteSearchQueryService: QuoteSearchQueryService,
    private readonly authStore: AuthStore,
    private readonly db: KyselyService,
  ) {}

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    const { ability } = this.authStore.getStore();
    return this.quoteRepository.getOne(id).andThen((quote) => {
      if (!ability.can('read', quote)) {
        return errAsync(new ForbiddenError());
      }

      return okAsync(quote);
    });
  }

  getList(
    quoteListQueryDto: QuoteListQueryDto,
  ): ResultAsync<QuoteList, GetQuoteListError> {
    const { pagination, filter, sort } = quoteListQueryDto;
    const parsedSearchQuery = this.quoteSearchQueryService.parse(
      filter?.q ?? '',
    );

    return this.quoteRepository.getList({
      pagination,
      sort,
      filter: parsedSearchQuery,
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
}
