import { type Kysely, sql } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const addVoting1780866360689: CustomMigration = {
  name: '1780866360689-add-voting',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .alterTable('quote')
      .addColumn('likes', 'integer', (col) => col.defaultTo(0).notNull())
      .addColumn('dislikes', 'integer', (col) => col.defaultTo(0).notNull())
      .execute();

    await db.schema
      .createTable('vote')
      .addColumn('userId', 'integer', (col) =>
        col.notNull().references('user.id'),
      )
      .addColumn('quoteId', 'integer', (col) =>
        col.notNull().references('quote.id'),
      )
      .addColumn('value', 'smallint', (col) => col.notNull())
      .addCheckConstraint('vote_valid_values_check', sql`value IN (-1, 1)`)
      .addPrimaryKeyConstraint('vote_pkey', ['userId', 'quoteId'])
      .execute();
  },

  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema.dropTable('vote').execute();

    await db.schema
      .alterTable('quote')
      .dropColumn('likes')
      .dropColumn('dislikes')
      .execute();
  },
};
