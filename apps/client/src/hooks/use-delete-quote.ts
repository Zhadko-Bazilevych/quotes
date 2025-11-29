import { toast } from 'sonner';

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

import { type DeleteQuoteVariables, mutations } from '@/api/mutations';
import { queries } from '@/api/queries';
import type { Quote } from '@/types/quote';

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
    onSuccess: (deletedQuote, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(deletedQuote, variables, onMutateResult, context);
      toast('Quote was deleted sucscessfully');
    },
    ...restOptions,
  });
}
