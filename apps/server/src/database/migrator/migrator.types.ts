import type { Kysely } from 'kysely';

export interface CustomMigration {
  name: string;
  up: (db: Kysely<unknown>) => Promise<void>;
  down?: (b: Kysely<unknown>) => Promise<void>;
}
