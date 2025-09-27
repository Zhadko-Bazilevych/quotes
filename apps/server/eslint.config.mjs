import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { config as baseConfig } from '@quotes/eslint-config/base';

export default defineConfig(
  ...baseConfig,
  { ignores: ['eslint.config.mjs'] },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
);
