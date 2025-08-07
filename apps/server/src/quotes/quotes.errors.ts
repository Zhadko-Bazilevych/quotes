import { TaggedError } from 'src/utils/errors/tagged-error';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: number;
}> {}
