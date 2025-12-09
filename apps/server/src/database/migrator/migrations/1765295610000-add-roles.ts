import { type Kysely } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const addRoles1765295610000: CustomMigration = {
  name: '1765295610000-add-roles',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .alterTable('user')
      .addColumn('role', 'varchar', (col) => col.defaultTo('user'))
      .addColumn('banned', 'boolean', (col) => col.defaultTo(false).notNull())
      .addColumn('banReason', 'varchar')
      .addColumn('banExpires', 'timestamp')
      .execute();

    await db.schema
      .alterTable('session')
      .addColumn('impersonatedBy', 'varchar')
      .execute();
  },

  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .alterTable('user')
      .dropColumn('role')
      .dropColumn('banned')
      .dropColumn('banReason')
      .dropColumn('banExpires')
      .execute();

    await db.schema
      .alterTable('session')
      .dropColumn('impersonatedBy')
      .execute();
  },
};
