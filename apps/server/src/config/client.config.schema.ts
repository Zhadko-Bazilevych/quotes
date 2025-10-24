import z from 'zod';

export const clientEnvSchema = z.object({
  CLIENT_URL: z.string(),
});
