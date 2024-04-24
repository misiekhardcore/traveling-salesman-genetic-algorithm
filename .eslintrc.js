module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'next',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    browser: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'next.config.js', 'tailwind.config.js', 'postcss.config.js'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
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
