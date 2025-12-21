import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

import type { SignOutVariables } from '@/api/auth-api';
import { mutations, type SignOutData } from '@/api/mutations';
import { queries } from '@/api/queries';

type UseSignOutMutationOptions = Omit<
  UseMutationOptions<SignOutData, unknown, SignOutVariables>,
  'mutationFn' | 'mutationKey'
>;

export function useSignOut(
  options?: UseSignOutMutationOptions,
): UseMutationResult<SignOutData, unknown, SignOutVariables> {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<SignOutData, unknown, SignOutVariables>({
    ...mutations.auth.signOut,
    onSuccess: (res, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(res, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
