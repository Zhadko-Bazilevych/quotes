import { betterAuthMigration1759428880000 } from 'src/database/migrator/migrations/1759428880000-better-auth-migration';
import type { CustomMigration } from '../migrator.types';
import { initialMigration1754422830000 } from './1754422830000-initial-migration';
import { migrateUsers1759503810000 } from 'src/database/migrator/migrations/1759503810000-migrate_users';

export const migrations: CustomMigration[] = [
  initialMigration1754422830000,
  betterAuthMigration1759428880000,
  migrateUsers1759503810000,
];
