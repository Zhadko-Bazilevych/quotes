import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { UserId } from 'src/database/tables/user.tables';
import type { Brand } from 'src/utils/types';

export type QuoteId = Brand<number, 'QuoteId'>;

export type QuoteVisibility = 'public' | 'private';

export interface QuoteTable {
  id: Generated<QuoteId>;
  userId: Generated<UserId>;
  author: string;
  content: string;
  context: string;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
  visibility: QuoteVisibility;
}

export type Quote = Selectable<QuoteTable>;
export type NewQuote = Insertable<QuoteTable>;
export type UpdateQuote = Updateable<QuoteTable>;
