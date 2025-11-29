import type { getSession } from 'better-auth/api';

export type LoginData = {
  email: string;
  password: string;
};

type BaseUserSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

export type AppSession = Omit<BaseUserSession['session'], 'id' | 'userId'> & {
  id: number;
  userId: number;
};

export type AppUser = Omit<BaseUserSession['user'], 'id'> & { id: number };

export type UserSession = {
  session: AppSession;
  user: AppUser;
};
