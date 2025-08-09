import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { GetQuotesQuery, Quote } from '@/types';
import { queries } from '@/api/queries';

type UseQuotesOptions = Omit<UseQueryOptions<Quote[]>, 'queryFn' | 'queryKey'>;

export function useQuotes(
  query?: GetQuotesQuery,
  options?: UseQuotesOptions,
): UseQueryResult<Quote[]> {
  return useQuery<Quote[]>({
    ...queries.quotes.getList(query),
    ...options,
  });
}
