import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { queries } from '@/api/queries';
import type { GetUsersQuery, UserList } from '@/types/user';

type UseUsersOptions = Omit<UseQueryOptions<UserList>, 'queryFn' | 'queryKey'>;

export function useUserList(
  query: GetUsersQuery,
  options?: UseUsersOptions,
): UseQueryResult<UserList> {
  return useQuery<UserList>({
    ...queries.users.getList(query),
    ...options,
  });
}
