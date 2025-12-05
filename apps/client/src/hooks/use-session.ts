import { useMemo } from 'react';

import { authClient } from '@/lib/auth-client';
import type { UserSession } from '@/types/auth';

type UseSessionReturn = Omit<
  ReturnType<typeof authClient.useSession>,
  'data'
> & { data: UserSession | null };

export const useSession = (): UseSessionReturn => {
  const { data, ...rest } = authClient.useSession();

  const sessionUser = data?.user;

  const user = useMemo(() => {
    if (!sessionUser) {
      return;
    }

    return {
      ...sessionUser,
      id: Number(sessionUser.id),
    };
  }, [sessionUser]);

  if (!data) {
    return {
      ...rest,
      data: null,
    };
  }

  return {
    ...rest,
    data: {
      user: user as UserSession['user'],
      session: {
        ...data.session,
        id: Number(data.session.id),
        userId: Number(data.session.userId),
      },
    },
  };
};