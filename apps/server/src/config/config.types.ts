import type { AppConfig } from 'src/config/app.config';
import type { AuthConfig } from 'src/config/auth.config';
import type { DatabaseConfig } from 'src/config/db.config';

export type Config = {
  app: AppConfig;
  db: DatabaseConfig;
  auth: AuthConfig;
};
