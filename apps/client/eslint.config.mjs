import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginQuery from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';
import { config as baseReactConfig } from '@quotes/eslint-config/react-internal';

export default defineConfig(
  ...baseReactConfig,
  { ignores: ['eslint.config.mjs', 'i18next.config.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactRefresh.configs.vite,
      ...pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
