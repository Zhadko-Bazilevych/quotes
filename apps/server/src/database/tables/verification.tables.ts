import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import type { Brand } from 'src/utils/types';

export type VerificationId = Brand<number, 'VerificationId'>;

export interface VerificationTable {
  id: Generated<VerificationId>;
  identifier: string;
  value: string;
  expiresAt: ColumnType<Date, Date, Date>;
  createdAt: ColumnType<Date, never, never>;
  updatedAt: ColumnType<Date, never, Date>;
}

export type Verification = Selectable<VerificationTable>;
export type NewVerification = Insertable<VerificationTable>;
export type UpdateVerification = Updateable<VerificationTable>;
