import z from 'zod';

import { defineConfig } from '@julr/vite-plugin-validate-env';

export default defineConfig({
  validator: 'standard',
  schema: {
    VITE_API_BASE_URL: z.url(),
    VITE_API_AUTH_URL: z.url(),
  },
});
