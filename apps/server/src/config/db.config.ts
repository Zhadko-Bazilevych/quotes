import { type ConfigType, registerAs } from '@nestjs/config';
import z from 'zod';

export const databaseEnvSchema = z.object({
  DB_DATABASE: z.string(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().int(),
});

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

export type DatabaseConfig = ConfigType<typeof dbConfig>;
