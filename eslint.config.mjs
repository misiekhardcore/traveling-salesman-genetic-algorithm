import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

const customConfig = nextVitals.map((config) => {
  // Add jest globals to the language options
  if (config.languageOptions) {
    return {
      ...config,
      languageOptions: {
        ...config.languageOptions,
        globals: {
          ...config.languageOptions.globals,
          ...globals.jest,
        },
      },
    };
  }

  // Add custom rules to the typescript config
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

const eslintConfig = defineConfig([
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

export default eslintConfig;
