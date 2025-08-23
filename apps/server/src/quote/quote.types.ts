import type { Quote } from 'src/database/kysely.service';
import { type QuoteNotFoundError } from 'src/quote/quote.errors';
import { type UnexpectedError } from 'src/utils/errors/app-errors';
import { type ListResponse } from 'src/utils/types';
import type { Brand } from 'src/utils/types';

export type QuoteId = Brand<number, 'QuoteId'>;

export type QuoteListResponse = ListResponse<Quote>;

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type GetQuoteListError = UnexpectedError;
export type CreateQuoteError = UnexpectedError;
export type UpdateQuoteError = QuoteNotFoundError | UnexpectedError;
export type DeleteQuoteError = QuoteNotFoundError | UnexpectedError;
