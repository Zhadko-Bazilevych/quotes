import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { mutations, type VoteQuoteVariables } from '@/api/mutations';
import type { SuccessResponse } from '@/types';

type UseVoteQuoteMutationOptions = Omit<
  UseMutationOptions<SuccessResponse, unknown, VoteQuoteVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useVoteQuoteMutation(
  options?: UseVoteQuoteMutationOptions,
): UseMutationResult<SuccessResponse, unknown, VoteQuoteVariables> {
  return useMutation<SuccessResponse, unknown, VoteQuoteVariables>({
    ...mutations.quotes.vote,
    ...options,
  });
}
