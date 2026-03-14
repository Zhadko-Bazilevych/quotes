import type { QueryFunction, QueryKey } from '@tanstack/react-query';

import type { GetQuotesQuery, Quote, QuoteList } from '@/types/quote';
import type { GetUsersQuery, UserList } from '@/types/user';

import { type Api, api } from './api';

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

type UsersGetListFn = (query: GetUsersQuery) => QueryDetails<UserList>;

type Queries = {
  quotes: {
    _def: ['quotes'];
    getList: WithDefaultKey<QuotesGetListFn>;
    getOneById: WithDefaultKey<QuotesGetOneByIdFn>;
  };
  users: {
    _def: ['users'];
    getList: WithDefaultKey<UsersGetListFn>;
  };
};

export function createQueries(api: Api): Queries {
  const getQuoteList: WithDefaultKey<QuotesGetListFn> = (query) => ({
    queryFn: () => api.quotes.getList(query),
    queryKey: ['quotes', 'getList', query],
  });
  getQuoteList._def = ['quotes', 'getList'];

  const getQuoteById: WithDefaultKey<QuotesGetOneByIdFn> = (id) => ({
    queryFn: () => api.quotes.getOneById(id),
    queryKey: ['quotes', 'getOneById', id],
  });
  getQuoteById._def = ['quotes', 'getList'];

  const getUserList: WithDefaultKey<UsersGetListFn> = (query) => ({
    queryFn: () => api.users.getList(query),
    queryKey: ['users', 'getList', query],
  });
  getUserList._def = ['users', 'getList'];

  return {
    quotes: {
      _def: ['quotes'],
      getList: getQuoteList,
      getOneById: getQuoteById,
    },
    users: {
      _def: ['users'],
      getList: getUserList,
    },
  };
}

export const queries = createQueries(api);
