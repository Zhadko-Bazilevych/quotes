import type { GetQuotesQuery, Quote, QuoteList } from '@/types/quotes';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithDefaultKey<TFn extends (...params: any) => any> = {
  (...params: Parameters<TFn>): ReturnType<TFn>;
  _def: unknown[];
};

type QuotesGetListFn = (query?: GetQuotesQuery) => QueryDetails<QuoteList>;
type QuotesGetOneByIdFn = (id: number) => QueryDetails<Quote>;

type Queries = {
  quotes: {
    _def: ['quotes'];
    getList: WithDefaultKey<QuotesGetListFn>;
    getOneById: WithDefaultKey<QuotesGetOneByIdFn>;
  };
};

export function createQueries(api: Api): Queries {
  const getList: WithDefaultKey<QuotesGetListFn> = (query) => ({
    queryFn: () => api.quotes.getList(query),
    queryKey: ['quotes', 'getList', query],
  });
  getList._def = ['quotes', 'getList'];

  const getOneById: WithDefaultKey<QuotesGetOneByIdFn> = (id) => ({
    queryFn: () => api.quotes.getOneById(id),
    queryKey: ['quotes', 'getOneById', id],
  });
  getOneById._def = ['quotes', 'getList'];

  return {
    quotes: {
      _def: ['quotes'],
      getList,
      getOneById,
    },
  };
}

export const queries = createQueries(api);
