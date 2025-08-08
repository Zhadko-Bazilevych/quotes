import { TaggedError } from 'src/utils/errors/tagged-error';
import { CustomNotFoundException } from 'src/utils/exceptions';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: number;
}> {}

export class QuoteNotFoundException extends CustomNotFoundException {
  constructor(id: number) {
    super('quote', id);
  }
}
