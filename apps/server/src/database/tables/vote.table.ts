import type { Insertable, Selectable, Updateable } from 'kysely';
import { type QuoteId } from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';

export type VoteQuoteValue = 1 | -1;

export interface VoteTable {
  userId: UserId;
  quoteId: QuoteId;
  value: VoteQuoteValue;
}

export type Vote = Selectable<VoteTable>;
export type NewVote = Insertable<VoteTable>;
export type UpdateVote = Updateable<VoteTable>;
