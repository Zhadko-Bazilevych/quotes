import type { SortOption } from '@/pages/quote-list-schema';
import type { ListResponse, WithTypename } from '@/types';

export type QuoteVisibility = 'public' | 'private';

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
    likes: number;
    dislikes: number;
    vote: number | null;
    visibility: QuoteVisibility;
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
    likes: number;
    dislikes: number;
    vote: number | null;
    visibility: QuoteVisibility;
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
