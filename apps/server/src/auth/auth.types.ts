import type { getSession } from 'better-auth/api';
import type { WithTypename } from 'src/types';

export type BaseUserSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

export type AppSession = Omit<BaseUserSession['session'], 'id' | 'userId'> & {
  id: number;
  userId: number;
};

export type Role = 'admin' | 'user';

export type AppUser = Omit<
  WithTypename<BaseUserSession['user'], 'User'>,
  'id'
> & {
  id: number;
  role: Role[];
};

export type UserSession = {
  session: AppSession;
  user: AppUser;
};
