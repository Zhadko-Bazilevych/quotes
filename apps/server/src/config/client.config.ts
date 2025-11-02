import { type ConfigType, registerAs } from '@nestjs/config';
import z from 'zod';

export const clientEnvSchema = z.object({
  CLIENT_URL: z.string(),
});

export const clientConfig = registerAs('client', () => {
  const parsed = clientEnvSchema.parse(process.env);

  return {
    url: parsed.CLIENT_URL,
  };
});

export type ClientConfig = ConfigType<typeof clientConfig>;
