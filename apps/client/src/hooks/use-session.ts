import { authClient } from '@/lib/auth-client';
import type { UserSession } from '@/types/auth';

type UseSessionReturn = Omit<
  ReturnType<typeof authClient.useSession>,
  'data'
> & { data: UserSession | null };

export const useSession = (): UseSessionReturn => {
  const { data, ...rest } = authClient.useSession();
  if (data) {
    return {
      ...rest,
      data: {
        user: {
          ...data.user,
          id: Number(data.user.id),
        },
        session: {
          ...data.session,
          id: Number(data.session.id),
          userId: Number(data.session.userId),
        },
      },
    };
  }
  return {
    ...rest,
    data,
  };
};
