import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { UserId } from 'src/database/tables/user.tables';
import type { Brand } from 'src/utils/types';

export type SessionId = Brand<number, 'SessionId'>;

export interface SessionTable {
  id: Generated<SessionId>;
  expiresAt: ColumnType<Date, Date, Date>;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: UserId;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type UpdateSession = Updateable<SessionTable>;
