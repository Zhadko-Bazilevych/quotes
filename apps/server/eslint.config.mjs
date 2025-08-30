import globals from 'globals';
import tseslint from 'typescript-eslint';
import { config as baseConfig } from '@quotes/eslint-config/base';

export default tseslint.config([
  ...baseConfig,
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
]);
