export type Quote = {
  id: number;
  author: string;
  user: string;
  content: string;
  context: string;
  createdAt: string;
  updatedAt: string;
};

export type GetQuotesQuery = { page?: number; size?: number };
export type QuoteCreateData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type QuoteUpdateData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
