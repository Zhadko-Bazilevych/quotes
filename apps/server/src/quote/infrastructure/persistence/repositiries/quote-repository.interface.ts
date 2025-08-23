import type { ResultAsync } from 'neverthrow';
import type { Quote } from 'src/quote/domain/quote';
import type { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';
import type { UpdateQuoteDto } from 'src/quote/dto/update-quote.dto';
import type {
  CreateQuoteError,
  DeleteQuoteError,
  GetQuoteError,
  GetQuoteListError,
  QuoteId,
  QuoteList,
  UpdateQuoteError,
} from 'src/quote/quote.types';
import type { PaginationOptions } from 'src/utils/dto/pagination.dto';

export type GetQuoteListOptions = {
  pagination: PaginationOptions;
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
