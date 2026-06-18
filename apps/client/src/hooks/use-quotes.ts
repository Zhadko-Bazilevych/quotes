import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { queries } from '@/api/queries';
import type { GetQuotesQuery, QuoteList } from '@/types/quote';

type UseQuotesOptions = Omit<
  UseQueryOptions<QuoteList, QuoteListError>,
  'queryFn' | 'queryKey'
>;

export type ParsingError = {
  type: 'parsingError';
  errors: { message: string }[];
};

export type QuoteListError = ParsingError | { type?: undefined };

export function useQuotes(
  query?: GetQuotesQuery,
  options?: UseQuotesOptions,
): UseQueryResult<QuoteList, QuoteListError> {
  return useQuery<QuoteList, QuoteListError>({
    ...queries.quotes.getList(query),
    ...options,
  });
}
