import type { authClient } from '@/lib/auth-client';
import type { WithTypename } from '@/types';

type BaseUserSession = typeof authClient.$Infer.Session;

export type AppSession = Omit<BaseUserSession['session'], 'id' | 'userId'> & {
  id: number;
  userId: number;
};

export type Role = 'admin' | 'user';

export type AppUser = Omit<
  WithTypename<BaseUserSession['user'], 'User'>,
  'id' | 'role'
> & {
  id: number;
  role: Role[];
};

export type UserSession = {
  session: AppSession;
  user: AppUser;
};
