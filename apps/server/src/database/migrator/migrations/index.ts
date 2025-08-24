import type { CustomMigration } from '../migrator.types';
import { initialMigration1754422830000 } from './1754422830000-initial-migration';

export const migrations: CustomMigration[] = [initialMigration1754422830000];
