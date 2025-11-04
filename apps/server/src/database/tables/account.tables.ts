import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { UserId } from 'src/database/tables/user.tables';
import type { Brand } from 'src/utils/types';

export type AccountId = Brand<number, 'AccountId'>;

export interface AccountTable {
  id: Generated<AccountId>;
  accountId: string;
  providerId: string;
  userId: UserId;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: ColumnType<Date, Date, Date>;
  refreshTokenExpiresAt: ColumnType<Date, Date, Date>;
  scope: string | null;
  password: string | null;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type UpdateAccount = Updateable<AccountTable>;
