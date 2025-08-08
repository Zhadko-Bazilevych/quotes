import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Quote, UpdateQuoteData } from '../types';
import { api } from '../utils/api';

type UpdateQuoteMutationVariables = { id: number; data: UpdateQuoteData };
type UseUpdateQuoteMutationOptions = Omit<
  UseMutationOptions<Quote, unknown, UpdateQuoteMutationVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useUpdateQuoteMutation(
  options?: UseUpdateQuoteMutationOptions,
): UseMutationResult<Quote, unknown, UpdateQuoteMutationVariables> {
  return useMutation<Quote, unknown, UpdateQuoteMutationVariables>({
    mutationFn: ({ id, data }: UpdateQuoteMutationVariables) =>
      api.updateQuote(id, data),
    mutationKey: ['quotes', 'update'],
    ...options,
  });
}
