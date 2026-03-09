import path from 'node:path';

import { defineConfig, type Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';

import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';

function i18nReload(): Plugin {
  return {
    name: 'i18nReload',
    configureServer: (server): void => {
      server.watcher.add('public/locales/**/*');

      server.watcher.on('change', (file) => {
        if (file.includes('public/locales/')) {
          server.ws.send({
            type: 'custom',
            event: 'i18nReload',
          });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      enableRouteGeneration: false,
    }),
    react(),
    tailwindcss(),
    ValidateEnv({
      configFile: 'src/env/config',
    }),
    svgr(),
    i18nReload(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
