import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Quote } from '@/types/quote';
import { queries } from '@/api/queries';
import { mutations, type CreateQuoteVariables } from '@/api/mutations';

type UseCreateQuoteMutationOptions = Omit<
  UseMutationOptions<Quote, unknown, CreateQuoteVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useCreateQuoteMutation(
  options?: UseCreateQuoteMutationOptions,
): UseMutationResult<Quote, unknown, CreateQuoteVariables> {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<Quote, unknown, CreateQuoteVariables>({
    ...mutations.quotes.create,
    onSuccess: (updatedQuote, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(updatedQuote, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
