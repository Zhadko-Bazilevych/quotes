import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { Brand } from 'src/utils/types';

export type QuoteId = Brand<number, 'QuoteId'>;

export interface QuoteTable {
  id: Generated<QuoteId>;
  user: string;
  author: string;
  content: string;
  context: string;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Quote = Selectable<QuoteTable>;
export type NewQuote = Insertable<QuoteTable>;
export type UpdateQuote = Updateable<QuoteTable>;
