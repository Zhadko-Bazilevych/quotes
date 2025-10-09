import type { QuoteId } from 'src/database/types/quote.types';
import type { UserId } from 'src/database/types/user.types';

export type QuoteEntity = {
  id: QuoteId;
  userId: UserId;
  author: string;
  content: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};
