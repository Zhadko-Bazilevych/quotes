import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { Brand } from 'src/utils/types';

export type UserId = Brand<number, 'UserId'>;

export interface UserTable {
  id: Generated<UserId>;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;
