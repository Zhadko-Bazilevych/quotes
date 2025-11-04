import { type ConfigType, registerAs } from '@nestjs/config';
import z from 'zod';

export const authEnvSchema = z.object({
  AUTH_BETTER_AUTH_SECRET: z.string(),
  AUTH_BETTER_AUTH_URL: z.string(),
});

export const authConfig = registerAs('auth', () => {
  const parsed = authEnvSchema.parse(process.env);

  return {
    betterAuthSecret: parsed.AUTH_BETTER_AUTH_SECRET,
    betterAuthUrl: parsed.AUTH_BETTER_AUTH_URL,
  };
});

export type AuthConfig = ConfigType<typeof authConfig>;
