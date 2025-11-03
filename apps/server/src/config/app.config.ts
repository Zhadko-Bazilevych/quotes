import { type ConfigType, registerAs } from '@nestjs/config';
import z from 'zod';

export const appEnvSchema = z.object({
  APP_CORS: z
    .string()
    .transform((cors) =>
      cors
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean),
    )
    .refine((val) => val.length > 0, 'pass at least one origin into APP_CORS'),
});

export const appConfig = registerAs('app', () => {
  const parsed = appEnvSchema.parse(process.env);

  return {
    cors: parsed.APP_CORS,
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
