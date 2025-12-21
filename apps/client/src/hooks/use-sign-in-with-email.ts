import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

import type { SignInWithEmailVariables } from '@/api/auth-api';
import { mutations, type SignInWithEmailData } from '@/api/mutations';
import { queries } from '@/api/queries';

type UseSignInMutationOptions = Omit<
  UseMutationOptions<SignInWithEmailData, unknown, SignInWithEmailVariables>,
  'mutationFn' | 'mutationKey'
>;

export type useSignInWithEmailResult = UseMutationResult<
  SignInWithEmailData,
  unknown,
  SignInWithEmailVariables
>;

export function useSignInWithEmail(
  options?: UseSignInMutationOptions,
): useSignInWithEmailResult {
  const { onSuccess, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation<SignInWithEmailData, unknown, SignInWithEmailVariables>({
    ...mutations.auth.signInWithEmail,
    onSuccess: (res, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: queries.quotes.getList._def,
      });
      onSuccess?.(res, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
