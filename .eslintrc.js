const {
  uiRules,
  unitTestRules,
  cypressRules,
  testDBManagerRules,
  i18nRules,
} = require('./eslint/rules');

const reactSettings = { react: { version: 'detect' } };
const nodeSettings = { node: { version: '>=23.9.0' } };
const jsxParserOptions = { ecmaFeatures: { jsx: true } };

function getExtends({
  react = false,
  node = false,
  jest = false,
  cypress = false,
} = {}) {
  return [
    'eslint:recommended',

    ...(react
      ? [
          'plugin:react/recommended',
          'plugin:react/jsx-runtime',
          'plugin:react-hooks/recommended',
          'plugin:jsx-a11y/recommended',
        ]
      : []),

    'plugin:import/recommended',
    'plugin:import/typescript',

    'plugin:@typescript-eslint/recommended',

    'plugin:@eslint-community/eslint-comments/recommended',

    ...(node ? ['plugin:n/recommended-module'] : []),

    ...(jest ? ['plugin:jest/recommended'] : []),

    ...(cypress ? ['plugin:cypress/recommended'] : []),

    'prettier',
  ];
}

const uiPlugins = [
  'react',
  'react-hooks',
  'jsx-a11y',
  '@typescript-eslint',
  'lodash',
  '@stylistic',
];

const nodePlugins = ['@typescript-eslint', 'lodash', 'n', '@stylistic'];

module.exports = {
  root: true,
  ignorePatterns: [
    'jore4-hasura',
    'test-db-manager/dist',
    'test-db-manager/ts-dist',
    '**/generated',
    'ui/jest.setup.ts',
  ],

  env: { es2024: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 15,
    sourceType: 'module',
    project: true,
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },

  overrides: [
    // UI code
    {
      files: ['ui/**/*.{ts,tsx}'],
      excludedFiles: ['ui/jest.setup.ts', 'ui/**/*.spec.{ts,tsx}'],
      env: { browser: true },
      parserOptions: jsxParserOptions,
      settings: reactSettings,
      extends: getExtends({ react: true }),
      plugins: uiPlugins,
      rules: uiRules,
    },

    // Jest based unit/integration tests in UI dir
    {
      files: ['ui/**/*.spec.{ts,tsx}'],
      env: { browser: true, node: true, jest: true },
      parser: '@typescript-eslint/parser',
      parserOptions: jsxParserOptions,
      settings: { ...reactSettings, ...nodeSettings },
      extends: getExtends({ react: true, node: true, jest: true }),
      plugins: [...uiPlugins, 'jest'],
      rules: unitTestRules,
    },

    // Localization files
    {
      files: ['ui/src/locales/**/*.json'],
      extends: ['plugin:i18n-json/recommended'],
      rules: i18nRules,
    },

    // Cypress
    {
      files: ['cypress/**/*.ts'],
      env: { node: true },
      settings: nodeSettings,
      extends: getExtends({ node: true, cypress: true }),
      plugins: nodePlugins,
      rules: cypressRules,
    },

    // Test DB Manager
    {
      files: ['test-db-manager/**/*.ts'],
      env: { node: true },
      settings: nodeSettings,
      extends: getExtends({ node: true }),
      plugins: nodePlugins,
      rules: testDBManagerRules,
    },
  ],
};
