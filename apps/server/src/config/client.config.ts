import { type ConfigType, registerAs } from '@nestjs/config';
import { clientEnvSchema } from 'src/config/client.config.schema';

export const clientConfig = registerAs('client', () => {
  const parsed = clientEnvSchema.parse(process.env);

  return {
    url: parsed.CLIENT_URL,
  };
});

export type ClientConfig = ConfigType<typeof clientConfig>;
