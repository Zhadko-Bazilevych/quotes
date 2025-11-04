import type { ResultAsync } from 'neverthrow';
import type { ParsedQuery } from 'src/search-query/search-query.types';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import type { QuoteListSortDto } from 'src/quote/dto/quote-list-query.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import type {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteList,
  QuoteSearchQueryKeywords,
  UpdateQuoteError,
} from 'src/quote/quote.types';
import type { PaginationDto } from 'src/utils/dto/pagination.dto';
import type { QuoteId } from 'src/database/tables/quote.tables';

export type QuoteListFilter = ParsedQuery<QuoteSearchQueryKeywords>;

export type GetQuoteListOptions = {
  pagination: PaginationDto;
  filter?: QuoteListFilter;
  sort?: QuoteListSortDto;
};

export abstract class QuoteRepository {
  abstract create(data: CreateQuoteDto): ResultAsync<Quote, CreateQuoteError>;

  abstract getOne(id: QuoteId): ResultAsync<Quote, GetQuoteError>;

  abstract update(
    id: QuoteId,
    data: UpdateQuoteDto,
  ): ResultAsync<Quote, UpdateQuoteError>;

  abstract getList(
    options: GetQuoteListOptions,
  ): ResultAsync<QuoteList, GetQuoteListError>;

  abstract delete(id: QuoteId): ResultAsync<Quote, DeleteQuoteError>;
}
