import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Quote } from '@/types/quotes';
import { queries } from '@/api/queries';
import { mutations, type UpdateQuoteVariables } from '@/api/mutations';

type UseUpdateQuoteMutationOptions = Omit<
  UseMutationOptions<Quote, unknown, UpdateQuoteVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useUpdateQuoteMutation(
  options?: UseUpdateQuoteMutationOptions,
): UseMutationResult<Quote, unknown, UpdateQuoteVariables> {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<Quote, unknown, UpdateQuoteVariables>({
    ...mutations.quotes.update,
    onSuccess: (updatedQuote, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(updatedQuote, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
