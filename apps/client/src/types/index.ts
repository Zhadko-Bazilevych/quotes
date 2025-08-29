import type { SortOption } from '@/pages/quote-list-schema';

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

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type QuoteListDto = ListResponse<QuoteDto>;

export type QuoteList = ListResponse<Quote>;

export type GetQuotesQuery = {
  pagination: { page?: number; pageSize?: number };
  filter?: { q?: string };
  sort?: SortOption[];
};
export type CreateQuoteData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuoteData = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;
