import z from 'zod';

import { type ConfigType, registerAs } from '@nestjs/config';

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
  APP_CLIENT_DOMAIN: z.string(),
});

export const appConfig = registerAs('app', () => {
  const parsed = appEnvSchema.parse(process.env);

  return {
    cors: parsed.APP_CORS,
    clientDomain: parsed.APP_CLIENT_DOMAIN,
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
