import { type Kysely, sql } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const addQuoteVisibility1766507457000: CustomMigration = {
  name: '1766507457000-add-quote-visibility',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .createType('post_visibility')
      .asEnum(['public', 'private'])
      .execute();

    await db.schema
      .alterTable('quote')
      .addColumn('visibility', sql`post_visibility`, (col) =>
        col.defaultTo(sql`'private'`).notNull(),
      )
      .execute();
  },

  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema.alterTable('quote').dropColumn('visibility').execute();
    await db.schema.dropType('post_visibility').execute();
  },
};
