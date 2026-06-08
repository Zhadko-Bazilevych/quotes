import type {
  QuoteId,
  QuoteVisibility,
} from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';
import { type VoteQuoteValue } from 'src/database/tables/vote.table';
import type { WithTypename } from 'src/types';

export type Quote = WithTypename<
  {
    id: QuoteId;
    userId: UserId;
    author: string;
    content: string;
    context: string;
    createdAt: Date;
    updatedAt: Date;
    visibility: QuoteVisibility;
    likes: number;
    dislikes: number;
    vote: VoteQuoteValue | null;
  },
  'Quote'
>;
