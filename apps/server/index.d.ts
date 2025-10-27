import type { getSession } from 'better-auth/api';

export type UserSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

declare global {
  namespace Express {
    interface Request {
      session: UserSession | null;
    }
  }
}
