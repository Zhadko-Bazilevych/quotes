import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

import { mutations, type VoteQuoteVariables } from '@/api/mutations';
import { queries } from '@/api/queries';
import type { SuccessResponse } from '@/types';

type UseVoteQuoteMutationOptions = Omit<
  UseMutationOptions<SuccessResponse, unknown, VoteQuoteVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useVoteQuoteMutation(
  options?: UseVoteQuoteMutationOptions,
): UseMutationResult<SuccessResponse, unknown, VoteQuoteVariables> {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse, unknown, VoteQuoteVariables>({
    onSuccess: (response, variables, onMutateResult, context) => {
      //TODO: do not re-render whole quote list just for a single vote (somehow)
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(response, variables, onMutateResult, context);
    },
    ...mutations.quotes.vote,
    ...restOptions,
  });
}
