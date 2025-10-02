import type { QuoteId } from 'src/database/types/quote.types';

export type QuoteEntity = {
  id: QuoteId;
  user: string;
  author: string;
  content: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};
