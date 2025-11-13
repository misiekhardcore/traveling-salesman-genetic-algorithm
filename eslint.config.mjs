import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  ...nextVitals,
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
