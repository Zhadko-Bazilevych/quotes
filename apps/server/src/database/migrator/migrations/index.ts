import { betterAuth1759428880000 } from 'src/database/migrator/migrations/1759428880000-better-auth';
import { migrateUsers1759503810000 } from 'src/database/migrator/migrations/1759503810000-migrate-users';

import { initialMigration1754422830000 } from './1754422830000-initial-migration';

import type { CustomMigration } from '../migrator.types';

export const migrations: CustomMigration[] = [
  initialMigration1754422830000,
  betterAuth1759428880000,
  migrateUsers1759503810000,
];
