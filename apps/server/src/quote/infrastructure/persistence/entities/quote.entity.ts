import type { QuoteId } from 'src/database/tables/quote.tables';
import type { UserId } from 'src/database/tables/user.tables';

export type QuoteEntity = {
  id: QuoteId;
  userId: UserId;
  author: string;
  content: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};
