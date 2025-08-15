import { type QuoteNotFoundError } from 'src/quotes/quotes.errors';
import { type UnexpectedError } from 'src/utils/errors/app-errors';

export type Quote = {
  id: number;
  author: string;
  content: string;
  user: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};

export type QuoteListResponse = {
  quotes: Quote[];
  totalPages: number;
};

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type GetQuoteListError = UnexpectedError;
export type CreateQuoteError = UnexpectedError;
export type UpdateQuoteError = QuoteNotFoundError | UnexpectedError;
export type DeleteQuoteError = QuoteNotFoundError | UnexpectedError;
