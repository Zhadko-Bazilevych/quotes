import { TaggedError } from 'src/utils/validation/tagged-error';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: number;
}> {}

export class UnexpectedError extends TaggedError('UnexpectedError') {}
