import type { authClient } from '@/lib/auth-client';
import type { WithTypename } from '@/types';

export type LoginData = {
  email: string;
  password: string;
};

type BaseUserSession = typeof authClient.$Infer.Session;

export type AppSession = Omit<BaseUserSession['session'], 'id' | 'userId'> & {
  id: number;
  userId: number;
};

export type AppUser = Omit<
  WithTypename<BaseUserSession['user'], 'User'>,
  'id' | 'role'
> & {
  id: number;
  role: ('admin' | 'user')[];
};

export type UserSession = {
  session: AppSession;
  user: AppUser;
};
