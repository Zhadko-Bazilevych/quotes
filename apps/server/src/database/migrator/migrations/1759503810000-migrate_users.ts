import { sql, type Kysely } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const migrateUsers1759503810000: CustomMigration = {
  name: '003_migrate_users_from_quotes',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  up: async (db: Kysely<any>): Promise<void> => {
    await db
      .insertInto('user')
      .columns(['name', 'email', 'emailVerified'])
      .expression((eb) =>
        eb
          .selectFrom('quote')
          .distinctOn('quote.user')
          .select((eb) => [
            'quote.user',
            sql`gen_random_uuid() || '@example.com'`.as('email'),
            eb.val(false).as('emailVerified'),
          ]),
      )
      .execute();

    await db.schema
      .alterTable('quote')
      .addColumn('userId', 'integer')
      .execute();

    await db
      .updateTable('quote')
      .set((eb) => ({
        userId: eb
          .selectFrom('user')
          .select('id')
          .whereRef('quote.user', '=', 'user.name')
          .limit(1),
      }))
      .execute();

    await db.schema
      .alterTable('quote')
      .addForeignKeyConstraint(
        'quote_user_fk',
        ['userId'],
        'user',
        ['id'],
        (cb) => cb.onDelete('cascade'),
      )
      .execute();

    await db.schema
      .alterTable('quote')
      .alterColumn('userId', (cb) => cb.setNotNull())
      .execute();

    await db.schema.alterTable('quote').dropColumn('user').execute();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  down: async (db: Kysely<any>): Promise<void> => {
    await db.schema
      .alterTable('quote')
      .addColumn('user', 'varchar(30)')
      .execute();

    await db
      .updateTable('quote')
      .set((eb) => ({
        user: eb
          .selectFrom('user')
          .select('name')
          .whereRef('quote.userId', '=', 'user.id')
          .limit(1),
      }))
      .execute();

    await db.schema
      .alterTable('quote')
      .alterColumn('user', (col) => col.setNotNull())
      .execute();

    await db.schema.alterTable('quote').dropColumn('userId').execute();
  },
};
