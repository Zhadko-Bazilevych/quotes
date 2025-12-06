import type { SortOption } from '@/pages/quote-list-schema';
import type { ListResponse, WithTypename } from '@/types';

export type Quote = WithTypename<
  {
    id: number;
    author: string;
    userId: number;
    user: {
      id: number;
      name: string;
    };
    content: string;
    context: string;
    createdAt: Date;
    updatedAt: Date;
  },
  'Quote'
>;

export type QuoteDto = WithTypename<
  {
    id: number;
    author: string;
    userId: number;
    user: {
      id: number;
      name: string;
    };
    content: string;
    context: string;
    createdAt: string;
    updatedAt: string;
  },
  'Quote'
>;

export type QuoteListDto = ListResponse<QuoteDto>;

export type QuoteList = ListResponse<Quote>;

export type GetQuotesQuery = {
  pagination: { page?: number; pageSize?: number };
  filter?: { q?: string };
  sort?: SortOption[];
};
export type CreateQuoteData = {
  user: string;
  author: string;
  content: string;
  context: string;
};
export type UpdateQuoteData = {
  user: string;
  author: string;
  content: string;
  context: string;
};
