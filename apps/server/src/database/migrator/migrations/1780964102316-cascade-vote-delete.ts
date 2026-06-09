import { type Kysely } from 'kysely';
import type { CustomMigration } from 'src/database/migrator/migrator.types';

export const cascadeVoteDelete1780964102316: CustomMigration = {
  name: '1780964102316-cascade-vote-delete',
  up: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .alterTable('vote')
      .dropConstraint('vote_quote_id_fkey')
      .execute();

    await db.schema
      .alterTable('vote')
      .addForeignKeyConstraint('vote_quote_id_fkey', ['quoteId'], 'quote', [
        'id',
      ])
      .onDelete('cascade')
      .execute();
  },

  down: async (db: Kysely<unknown>): Promise<void> => {
    await db.schema
      .alterTable('vote')
      .dropConstraint('vote_quote_id_fkey')
      .execute();

    await db.schema
      .alterTable('vote')
      .addForeignKeyConstraint('vote_quote_id_fkey', ['quoteId'], 'quote', [
        'id',
      ])
      .onDelete('no action')
      .execute();
  },
};
