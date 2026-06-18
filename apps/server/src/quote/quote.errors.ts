import type { QuoteId } from 'src/database/tables/quote.tables';
import { TaggedError } from 'src/utils/errors/tagged-error';
import { CustomNotFoundException } from 'src/utils/exceptions';

import { BadRequestException } from '@nestjs/common';

export class QuoteNotFoundError extends TaggedError('QuoteNotFoundError')<{
  id: QuoteId;
}> {}

export class QuoteNotFoundException extends CustomNotFoundException {
  constructor(id: QuoteId) {
    super('quote', id);
  }
}

export class ParsingError extends TaggedError('ParsingError')<{
  errors: { message: string }[];
}> {}

export class ParsingException extends BadRequestException {
  constructor(errors: { message: string }[]) {
    super({ type: 'parsingError', errors });
  }
}
