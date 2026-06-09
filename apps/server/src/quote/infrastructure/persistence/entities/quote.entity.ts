import type {
  QuoteId,
  QuoteVisibility,
} from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';
import { type VoteQuoteValue } from 'src/database/tables/vote.table';

export type QuoteEntity = {
  id: QuoteId;
  userId: UserId;
  author: string;
  content: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  vote?: VoteQuoteValue;
  visibility: QuoteVisibility;
};
