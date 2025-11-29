import { ResultAsync } from 'neverthrow';
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
  ) {}

  getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError> {
    return this.quoteRepository.getOne(id);
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

  create(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError> {
    return this.quoteRepository.create(data);
  }

  update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError> {
    return this.quoteRepository.update(id, data);
  }

  delete(id: QuoteId): ResultAsync<Quote, DeleteQuoteError> {
    return this.quoteRepository.delete(id);
  }
}
