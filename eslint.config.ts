// eslint.config.ts
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginReact from 'eslint-plugin-react';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '**/node_modules/**']),
  // Configuration for source files
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
        },
      },
      react: {
        version: 'detect',
      },
    },
    plugins: {
      prettier,
      import: eslintPluginImport,
      react: eslintPluginReact,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'prettier/prettier': 'error',

      'no-console': 'off',
      'import/no-unresolved': 'error',
      'import/no-deprecated': 'warn',
      'no-unused-vars': 'off', // Turned off in favor of TS rule
      'no-warning-comments': 'warn',
      'no-nested-ternary': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-deprecated': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  // Configuration for config files (without type checking)
  {
    files: ['*.{ts,js}', '*.config.{ts,js}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
      // No project configuration for config files to avoid type checking issues
    },
    plugins: {
      prettier,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Disable type-checking rules for config files
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
]);
