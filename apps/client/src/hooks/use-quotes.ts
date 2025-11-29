import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { queries } from '@/api/queries';
import type { GetQuotesQuery, QuoteList } from '@/types/quote';

type UseQuotesOptions = Omit<
  UseQueryOptions<QuoteList>,
  'queryFn' | 'queryKey'
>;

export function useQuotes(
  query?: GetQuotesQuery,
  options?: UseQuotesOptions,
): UseQueryResult<QuoteList> {
  return useQuery<QuoteList>({
    ...queries.quotes.getList(query),
    ...options,
  });
}
