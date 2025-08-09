import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { GetQuotesQuery, Quote } from '../types';
import { api } from '../api/api';

type UseQuotesOptions = Omit<UseQueryOptions<Quote[]>, 'queryFn' | 'queryKey'>;

export function useQuotes(
  query?: GetQuotesQuery,
  options?: UseQuotesOptions,
): UseQueryResult<Quote[]> {
  return useQuery<Quote[]>({
    queryFn: () => {
      return api.quotes.getList(query);
    },
    queryKey: ['quotes', 'list', query],
    ...options,
  });
}
