import type { Quote } from './domain/quote';
import type { QuoteNotFoundError } from 'src/quote/quote.errors';
import type { UnexpectedError } from 'src/utils/errors/app-errors';
import type { ListResponse } from 'src/utils/types';
import type { Brand } from 'src/utils/types';
import type { QUOTE_SEARCH_QUERY_KEYWORDS } from './quote.constants';
import type { SearchQueryService } from 'src/search-query/search-query.service';
import type { MakeKeywords } from 'src/search-query/search-query.types';

export type QuoteId = Brand<number, 'QuoteId'>;

export type QuoteList = ListResponse<Quote>;

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type GetQuoteListError = UnexpectedError;
export type CreateQuoteError = UnexpectedError;
export type UpdateQuoteError = QuoteNotFoundError | UnexpectedError;
export type DeleteQuoteError = QuoteNotFoundError | UnexpectedError;

export type QuoteSearchQueryKeywords =
  (typeof QUOTE_SEARCH_QUERY_KEYWORDS)[number];
export type QuoteSearchQuerySearvice = SearchQueryService<
  QuoteSearchQueryKeywords,
  MakeKeywords<QuoteSearchQueryKeywords>
>;
