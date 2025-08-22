import { TaggedError } from 'src/utils/errors/tagged-error';
import { CustomNotFoundException } from 'src/utils/exceptions';
import type { QuoteId } from 'src/quote/quote.types';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: QuoteId;
}> {}

export class QuoteNotFoundException extends CustomNotFoundException {
  constructor(id: QuoteId) {
    super('quote', id);
  }
}
