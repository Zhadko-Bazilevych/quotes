import path from 'node:path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { KyselyService } from 'src/database/kysely.service';
import { Injectable } from '@nestjs/common';

const LATEST_MIGRATION = '001_initial';

@Injectable()
export class MigratorService {
  constructor(private readonly db: KyselyService) {}

  async migrate(): Promise<void> {
    const migrator = new Migrator({
      db: this.db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, 'migrations'),
      }),
    });
    const { error, results } = await migrator.migrateTo(LATEST_MIGRATION);

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(
          `migration "${it.migrationName}" was executed successfully`,
        );
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error('failed to migrate');
      console.error(error);
      process.exit(1);
    }
  }
}
