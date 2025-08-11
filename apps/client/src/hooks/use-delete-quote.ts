import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Quote } from '@/types';
import { queries } from '@/api/queries';
import { mutations, type DeleteQuoteVariables } from '@/api/mutations';

type UseDeleteQuoteMutationOptions = Omit<
  UseMutationOptions<Quote, unknown, DeleteQuoteVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useDeleteQuoteMutation(
  options?: UseDeleteQuoteMutationOptions,
): UseMutationResult<Quote, unknown, DeleteQuoteVariables> {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<Quote, unknown, DeleteQuoteVariables>({
    ...mutations.quotes.delete,
    onSuccess: (deletedQuote, variables, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList().queryKey,
      });
      onSuccess?.(deletedQuote, variables, context);
    },
    ...restOptions,
  });
}
