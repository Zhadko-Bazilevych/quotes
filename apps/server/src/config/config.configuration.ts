import { type ConfigType, registerAs } from '@nestjs/config';
import { databaseEnvSchema } from './config.schema';

export const dbConfig = registerAs('db', () => {
  const parsed = databaseEnvSchema.parse(process.env);

  return {
    database: parsed.DB_DATABASE,
    host: parsed.DB_HOST,
    user: parsed.DB_USER,
    password: parsed.DB_PASSWORD,
    port: parsed.DB_PORT,
  };
});

type DatabaseConfig = ConfigType<typeof dbConfig>;

export type Config = {
  db: DatabaseConfig;
};
