import type { QuoteEntity } from 'src/quote/infrastructure/persistence/entities/quote.entity';

export type QuoteAggregateEntity = QuoteEntity & {
  name: string;
};
