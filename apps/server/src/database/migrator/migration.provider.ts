import type { Migration, MigrationProvider } from 'kysely';
import { migrations } from './migrations';

export class CustomMigrationProvider implements MigrationProvider {
  getMigrations(): Promise<Record<string, Migration>> {
    return Promise.resolve(
      migrations.reduce<Record<string, Migration>>(
        (acc, { name, up, down }) => ({
          ...acc,
          [name]: { up, down },
        }),
        {},
      ),
    );
  }
}
