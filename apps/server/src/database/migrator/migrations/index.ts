import { betterAuth1759428880000 } from 'src/database/migrator/migrations/1759428880000-better-auth';
import { migrateUsers1759503810000 } from 'src/database/migrator/migrations/1759503810000-migrate-users';
import { addRoles1765295610000 } from 'src/database/migrator/migrations/1765295610000-add-roles';
import { addQuoteVisibility1766507457000 } from 'src/database/migrator/migrations/1766507457000-add-quote-visibility';
import { addVoting1780866360689 } from 'src/database/migrator/migrations/1780866360689-add-voting';
import { cascadeVoteDelete1780964102316 } from 'src/database/migrator/migrations/1780964102316-cascade-vote-delete';

import { initialMigration1754422830000 } from './1754422830000-initial-migration';

import type { CustomMigration } from '../migrator.types';

export const migrations: CustomMigration[] = [
  initialMigration1754422830000,
  betterAuth1759428880000,
  migrateUsers1759503810000,
  addRoles1765295610000,
  addQuoteVisibility1766507457000,
  addVoting1780866360689,
  cascadeVoteDelete1780964102316,
];
