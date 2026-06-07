import type { Insertable, Selectable, Updateable } from 'kysely';
import { type QuoteId } from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';
import type { Brand } from 'src/utils/types';

export type VoteId = Brand<number, 'VoteId'>;

export interface VoteTable {
  userId: UserId;
  quoteId: QuoteId;
  value: number;
}

export type Vote = Selectable<VoteTable>;
export type NewVote = Insertable<VoteTable>;
export type UpdateVote = Updateable<VoteTable>;
