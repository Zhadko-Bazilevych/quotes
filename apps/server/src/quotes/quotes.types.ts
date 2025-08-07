import {
  QuoteNotFoundError,
  UnexpectedError,
} from 'src/utils/validation/app-errors';

export type Quote = {
  id: number;
  author: string;
  content: string;
  user: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetQuoteError = QuoteNotFoundError | UnexpectedError;
export type CreateQuoteError = UnexpectedError;
