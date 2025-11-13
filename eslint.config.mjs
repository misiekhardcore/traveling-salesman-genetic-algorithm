import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

// Extend nextVitals config with custom settings
const customConfig = nextVitals.map((config) => {
  // Add jest globals and parser to the main config
  if (config.languageOptions) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parser: tsParser,
        sourceType: 'module',
        parserOptions: {
          ...config.languageOptions.parserOptions,
          project: ['tsconfig.json'],
        },
        globals: {
          ...config.languageOptions.globals,
          ...globals.browser,
          ...globals.jest,
        },
      },
    };
  }

  // Add custom TypeScript rule to the typescript config
  if (config.name === 'next/typescript') {
    return {
      ...config,
      rules: {
        ...config.rules,
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    };
  }

  return config;
});

export default defineConfig([
  ...customConfig,
  {
    plugins: {
      'testing-library': testingLibrary,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  globalIgnores([
    '**/jest.config.js',
    '**/cypress.config.ts',
    '**/jest.setup.js',
    '**/lint-staged.config.js',
    '**/next.config.js',
    '**/prettier.config.js',
    '**/next-env.d.ts',
    '.next',
    '.yarn',
    '.swc',
    'node_modules',
  ]),
]);
