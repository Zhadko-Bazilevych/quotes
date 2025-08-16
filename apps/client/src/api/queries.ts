import type { GetQuotesQuery, Quote, QuoteList } from '@/types';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import { api, type Api } from './api';

type QueryDetails<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = {
  queryFn: QueryFunction<T, TQueryKey, TPageParam>;
  queryKey: TQueryKey;
};

type Queries = {
  quotes: {
    getList: (query?: GetQuotesQuery) => QueryDetails<QuoteList>;
    getOneById: (id: number) => QueryDetails<Quote>;
  };
};

// TODO: fix queries not invalidating properly
export function createQueries(api: Api): Queries {
  return {
    quotes: {
      getList: (query) => ({
        queryFn: () => api.quotes.getList(query),
        queryKey: ['quotes', 'getList', query],
      }),
      getOneById: (id) => ({
        queryFn: () => api.quotes.getOneById(id),
        queryKey: ['quotes', 'getOneById', id],
      }),
    },
  };
}

export const queries = createQueries(api);
