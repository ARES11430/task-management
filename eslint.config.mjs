import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
  // 1. Global ignores
  {
    ignores: ['dist', 'eslint.config.mjs', 'node_modules'],
  },

  // 2. Base JavaScript recommendations
  eslint.configs.recommended,

  // 3. TypeScript specific configuration block
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'prettier/prettier': 'off',
    },
  },

  // 4. Prettier configuration (should be last)
  eslintPluginPrettierRecommended,
];
