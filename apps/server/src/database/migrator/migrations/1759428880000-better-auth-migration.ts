import type { Kysely } from 'kysely';
import { sql } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const betterAuthMigration1759428880000: CustomMigration = {
  name: '002_better_auth',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .createTable('user')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('email', 'text', (col) => col.notNull().unique())
      .addColumn('emailVerified', 'boolean', (col) => col.notNull())
      .addColumn('image', 'text')
      .addColumn('createdAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('updatedAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();

    await db.schema
      .createTable('session')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
      .addColumn('token', 'text', (col) => col.notNull().unique())
      .addColumn('createdAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('updatedAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('ipAddress', 'text')
      .addColumn('userAgent', 'text')
      .addColumn('userId', 'integer', (col) =>
        col.notNull().references('user.id').onDelete('cascade'),
      )
      .execute();

    await db.schema
      .createTable('account')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('accountId', 'text', (col) => col.notNull())
      .addColumn('providerId', 'text', (col) => col.notNull())
      .addColumn('userId', 'integer', (col) =>
        col.notNull().references('user.id').onDelete('cascade'),
      )
      .addColumn('accessToken', 'text')
      .addColumn('refreshToken', 'text')
      .addColumn('idToken', 'text')
      .addColumn('accessToken_expiresAt', 'timestamp')
      .addColumn('refreshToken_expiresAt', 'timestamp')
      .addColumn('scope', 'text')
      .addColumn('password', 'text')
      .addColumn('createdAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('updatedAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();

    await db.schema
      .createTable('verification')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('identifier', 'text', (col) => col.notNull())
      .addColumn('value', 'text', (col) => col.notNull())
      .addColumn('expiresAt', 'timestamp', (col) => col.notNull())
      .addColumn('createdAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .addColumn('updatedAt', 'timestamp', (col) =>
        col.defaultTo(sql`now()`).notNull(),
      )
      .execute();
  },

  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema.dropTable('verification').execute();
    await db.schema.dropTable('account').execute();
    await db.schema.dropTable('session').execute();
    await db.schema.dropTable('user').execute();
  },
};
