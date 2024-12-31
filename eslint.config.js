const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tseslint = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintRecommended = require('@eslint/js').configs.recommended;
const nodePlugin = require('eslint-plugin-node');

module.exports = [
  eslintRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: 2021,
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tseslint,
      node: nodePlugin,
    },
    settings: {
      node: {
        tryExtensions: ['.js', '.json', '.node', '.ts'],
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  // Add Prettier rules at the end to override other rules
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      ...require('eslint-config-prettier').rules,
    },
  },
];
