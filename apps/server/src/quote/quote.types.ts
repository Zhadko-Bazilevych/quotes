import type { QuoteAggregate } from 'src/quote/domain/quote-aggregate';
import type { QUOTE_SEARCH_QUERY_KEYWORDS } from 'src/quote/quote.constants';
import type { ParsingError, QuoteNotFoundError } from 'src/quote/quote.errors';
import type { SearchQueryService } from 'src/search-query/search-query.service';
import type { WithDefaultKeyword } from 'src/search-query/search-query.types';
import type {
  ForbiddenError,
  MissingUserError,
  UnexpectedError,
} from 'src/utils/errors/app-errors';
import type { ListResponse } from 'src/utils/types';

export type QuoteList = ListResponse<QuoteAggregate>;

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type GetQuoteListError = UnexpectedError | ParsingError;
export type CreateQuoteError =
  | UnexpectedError
  | MissingUserError
  | ForbiddenError;
export type UpdateQuoteError =
  | QuoteNotFoundError
  | UnexpectedError
  | ForbiddenError;
export type DeleteQuoteError =
  | QuoteNotFoundError
  | UnexpectedError
  | ForbiddenError;
export type VoteQuoteError =
  | QuoteNotFoundError
  | UnexpectedError
  | MissingUserError;

export type QuoteSearchQueryKeywords =
  (typeof QUOTE_SEARCH_QUERY_KEYWORDS)[keyof typeof QUOTE_SEARCH_QUERY_KEYWORDS];
export type QuoteSearchQueryService = SearchQueryService<
  WithDefaultKeyword<QuoteSearchQueryKeywords>
>;
