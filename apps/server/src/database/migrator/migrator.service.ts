import { Migrator } from 'kysely';
import { Injectable } from '@nestjs/common';
import { CustomMigrationProvider } from './migration.provider';
import { InternalKyselyService } from 'src/database/kysely.service';

@Injectable()
export class MigratorService {
  constructor(private readonly db: InternalKyselyService) {}

  async migrate(): Promise<void> {
    const migrator = new Migrator({
      db: this.db,
      provider: new CustomMigrationProvider(),
    });
    const { error, results } = await migrator.migrateToLatest();

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
