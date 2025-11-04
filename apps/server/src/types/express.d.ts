import type { UserSession } from 'src/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      session: UserSession | null;
    }
  }
}
