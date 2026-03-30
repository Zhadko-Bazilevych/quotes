import z from 'zod';

import { type ConfigType, registerAs } from '@nestjs/config';

export const authEnvSchema = z.object({
  AUTH_BETTER_AUTH_SECRET: z.string(),
  AUTH_BETTER_AUTH_URL: z.string(),
  AUTH_GOOGLE_CLIENT_ID: z.string(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string(),
});

export const authConfig = registerAs('auth', () => {
  const parsed = authEnvSchema.parse(process.env);

  return {
    betterAuthSecret: parsed.AUTH_BETTER_AUTH_SECRET,
    betterAuthUrl: parsed.AUTH_BETTER_AUTH_URL,
    googleClientId: parsed.AUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: parsed.AUTH_GOOGLE_CLIENT_SECRET,
  };
});

export type AuthConfig = ConfigType<typeof authConfig>;
