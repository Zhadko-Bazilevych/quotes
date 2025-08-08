import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { api } from '../utils/api';
import type { GetQuotesQuery, Quote } from '../types';

type UseQuotesOptions = Omit<UseQueryOptions<Quote[]>, 'queryFn' | 'queryKey'>;

export function useQuotes(
  query?: GetQuotesQuery,
  options?: UseQuotesOptions,
): UseQueryResult<Quote[]> {
  return useQuery<Quote[]>({
    queryFn: () => {
      return api.getQuotes(query);
    },
    queryKey: ['quotes', 'list', query],
    ...options,
  });
}
