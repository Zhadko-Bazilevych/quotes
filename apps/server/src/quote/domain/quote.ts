import type { QuoteId } from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';
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
  },
  'Quote'
>;
