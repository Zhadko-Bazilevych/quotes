import type { QuoteNotFoundError } from 'src/quote/quote.errors';
import type { UnexpectedError } from 'src/utils/errors/app-errors';
import type { ListResponse } from 'src/utils/types';
import type { SearchQueryService } from 'src/search-query/search-query.service';
import type { WithDefaultKeyword } from 'src/search-query/search-query.types';
import type { QuoteRead } from 'src/quote/domain/quote-read';
import type { QUOTE_SEARCH_QUERY_KEYWORDS } from 'src/quote/quote.constants';

export type QuoteList = ListResponse<QuoteRead>;

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type GetQuoteListError = UnexpectedError;
export type CreateQuoteError = UnexpectedError;
export type UpdateQuoteError = QuoteNotFoundError | UnexpectedError;
export type DeleteQuoteError = QuoteNotFoundError | UnexpectedError;

export type QuoteSearchQueryKeywords =
  (typeof QUOTE_SEARCH_QUERY_KEYWORDS)[keyof typeof QUOTE_SEARCH_QUERY_KEYWORDS];
export type QuoteSearchQueryService = SearchQueryService<
  WithDefaultKeyword<QuoteSearchQueryKeywords>
>;
