import type { QuoteId } from 'src/database/types/quote.types';
import { TaggedError } from 'src/utils/errors/tagged-error';
import { CustomNotFoundException } from 'src/utils/exceptions';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: QuoteId;
}> {}

export class QuoteNotFoundException extends CustomNotFoundException {
  constructor(id: QuoteId) {
    super('quote', id);
  }
}
