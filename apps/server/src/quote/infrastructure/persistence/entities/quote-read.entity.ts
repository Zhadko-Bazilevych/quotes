import type { QuoteEntity } from 'src/quote/infrastructure/persistence/entities/quote.entity';

export type QuoteReadEntity = QuoteEntity & {
  name: string;
};
