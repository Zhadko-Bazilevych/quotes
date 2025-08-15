export type Quote = {
  id: number;
  author: string;
  user: string;
  content: string;
  context: string;
  createdAt: Date;
  updatedAt: Date;
};

export type QuoteDto = {
  id: number;
  author: string;
  user: string;
  content: string;
  context: string;
  createdAt: string;
  updatedAt: string;
};

export type QuoteListDto = {
  quotes: QuoteDto[];
  totalPages: number;
};

export type QuoteList = {
  quotes: Quote[];
  totalPages: number;
};

export type GetQuotesQuery = { page?: number; size?: number };
export type CreateQuoteData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuoteData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
