import type { ClientConfig } from 'src/config/client.config';
import type { DatabaseConfig } from 'src/config/db.config';

export type Config = {
  db: DatabaseConfig;
  client: ClientConfig;
};
