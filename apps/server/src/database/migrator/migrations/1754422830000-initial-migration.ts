import { type Kysely, sql } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const initialMigration1754422830000: CustomMigration = {
  name: '001_initial',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .createTable('quote')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user', 'varchar(30)', (col) => col.notNull())
      .addColumn('author', 'varchar(30)', (col) => col.notNull())
      .addColumn('content', 'varchar(500)', (col) => col.notNull())
      .addColumn('context', 'varchar(500)', (col) => col.notNull())
      .addColumn('createdAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('updatedAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();
  },
  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema.dropTable('quote').execute();
  },
};
