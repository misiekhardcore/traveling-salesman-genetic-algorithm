import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintJs from '@eslint/js';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import tsEslint from 'typescript-eslint';
import globals from 'globals';

// Extend nextVitals config with custom settings
const customConfig = nextVitals.map((config) => {
  // Add jest globals and parser to the main config
  if (config.languageOptions) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        parser: tsEslint.parser,
        sourceType: 'module',
        parserOptions: {
          ...config.languageOptions.parserOptions,
          projectServices: true,
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

export default defineConfig(
  ...customConfig,
  // Override react version from eslint-config-next to avoid calling the removed
  // context.getFilename() API in eslint-plugin-react when using ESLint v10
  {
    settings: {
      react: {
        version: '19',
      },
    },
  },
  // Disable eslint-plugin-react rules superseded by @eslint-react, then add
  // @eslint-react for modern ESLint v10 native React linting
  {
    extends: [
      eslintJs.configs.recommended,
      tsEslint.configs.recommended,
      eslintReact.configs['disable-conflict-eslint-plugin-react'],
      eslintReact.configs['recommended-typescript'],
    ],
    plugins: {
      'testing-library': testingLibrary,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
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
  ])
);
