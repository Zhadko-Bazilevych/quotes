import z from 'zod';

export const databaseEnvSchema = z.object({
  DB_DATABASE: z.string(),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number().int(),
});
