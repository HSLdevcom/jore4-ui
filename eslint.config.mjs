import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import stylistic from '@stylistic/eslint-plugin';
import configPrettier from 'eslint-config-prettier/flat';
import cypress from 'eslint-plugin-cypress';
import i18nJson from 'eslint-plugin-i18n-json';
import importPlugin from 'eslint-plugin-import';
import lodash from 'eslint-plugin-lodash';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import n from 'eslint-plugin-n';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import {
  uiRules,
  unitTestRules,
  cypressRules,
  nodeProjectRules,
  i18nRules,
} from './eslint/rules/index.js';
import packageJson from './package.json' with { type: 'json' };

// Import types
/**
 * @typedef {import('typescript-eslint').ConfigWithExtends} ConfigWithExtends
 * @typedef {import('typescript-eslint').InfiniteDepthConfigWithExtends} InfiniteDepthConfigWithExtends
 * @typedef {import('@typescript-eslint/utils/dist/ts-eslint/Config.d.ts').FlatConfig.Plugin} Plugin
 */

const expectedI18nEslintPluginVersion = '4.0.1';
const i18nEslintPluginVersion =
  packageJson?.devDependencies?.['eslint-plugin-i18n-json'];

// At the time of writing eslint-plugin-i18n-json does not provide proper
// ESLint V9 compatible ESLint plugin implementation, so we need to manually
// define a plugin for it. Future versions might provide a proper plugin upstream.
// If you have updated the package, please see if it provides a proper plugin
// implementation and get rid of this custom one, and this version assert.
if (expectedI18nEslintPluginVersion !== i18nEslintPluginVersion) {
  throw new Error(
    `Expected to eslint-plugin-i18n-json version to be defined in the package.json devDependencies section and to have value '${expectedI18nEslintPluginVersion}' but value is '${i18nEslintPluginVersion}'! Please see eslint.config.mjs for more information.`,
  );
}

/**
 * @type {Plugin}
 */
const i18nPlugin = {
  meta: {
    name: 'eslint-plugin-i18n-json',
    namespace: 'i18n-json',
    version: expectedI18nEslintPluginVersion,
  },
  rules: i18nJson.rules,
  processors: {
    json: {
      meta: { name: 'json', version: expectedI18nEslintPluginVersion },
      ...i18nJson.processors['.json'],
    },
  },
};

/**
 * @param {boolean} useReact
 * @param {boolean} useNode
 * @param {boolean} useJest
 * @param {boolean} useCypress
 * @return {InfiniteDepthConfigWithExtends}
 */
function getExtends({
  react: useReact = false,
  node: useNode = false,
  jest: useJest = false,
  cypress: useCypress = false,
} = {}) {
  return [
    js.configs.recommended,

    ...(useReact
      ? [
          react.configs.flat['recommended'],
          react.configs.flat['jsx-runtime'],
          reactHooks.configs.flat['recommended-latest'],
          jsxA11y.flatConfigs['recommended'],
        ]
      : []),

    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,

    tsEslint.configs.recommended,

    comments.recommended,

    ...(useNode ? [n.configs['flat/recommended-module']] : []),

    ...(useJest ? [jest.configs['flat/recommended']] : []),

    ...(useCypress ? [cypress.configs.recommended] : []),

    configPrettier,
  ];
}

/**
 * @param {string} tsconfigPath
 * @param {ConfigWithExtends} config
 * @return ConfigWithExtends
 */
function tsConfig(tsconfigPath, config) {
  const userLangOptions = config.languageOptions ?? {};
  const userParserOptions = userLangOptions.parserOptions ?? {};
  const userSettings = config.settings ?? {};
  const userImportResolverSettings = userSettings['import/resolver'] ?? {};

  return config;

  return {
    ...config,
    languageOptions: {
      ...userLangOptions,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
        // Allow overriding properties
        ...userParserOptions,
      },
    },
    settings: {
      ...userSettings,
      'import/resolver': {
        typescript: tsconfigPath,
        // Allow overriding properties
        ...userImportResolverSettings,
      },
    },
  };
}

export default tsEslint.config(
  // Global ignores
  {
    ignores: [
      'jore4-hasura',
      'test-db-manager/dist',
      'test-db-manager/ts-dist',
      '**/generated',
      'ui/jest.setup.ts',
      'ui/.next',
      'ui/next-env.d.ts',
      'ui/out',
      '**/.rollup.cache',
    ],
  },

  // Generic shared setup for ts/tsx files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 15,
        sourceType: 'module',
        projectService: true,
      },
      globals: globals.es2024,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
      react: { version: 'detect' },
      node: { version: '>=23.9.0' },
    },
    plugins: {
      // Other plugins get automatically added in by the shared configs (extends)
      '@stylistic': stylistic,
      js,
      lodash,
    },
  },

  // UI code
  tsConfig('ui/tsconfig.json', {
    files: ['ui/**/*.{ts,tsx}'],
    ignores: ['ui/**/*.spec.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: getExtends({ react: true }),
    rules: uiRules,
  }),

  // Jest based unit/integration tests in UI dir
  tsConfig('ui/tsconfig.json', {
    files: ['ui/**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    extends: getExtends({ react: true, node: true, jest: true }),
    rules: unitTestRules,
  }),

  // Localization files
  {
    files: ['ui/src/locales/**/*.json'],
    plugins: { 'i18n-json': i18nPlugin },
    processor: 'i18n-json/json',
    rules: {
      ...i18nJson.configs.recommended.rules,
      ...i18nRules,
    },
  },

  // Cypress
  tsConfig('cypress/tsconfig.json', {
    files: ['cypress/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true, cypress: true }),
    rules: cypressRules,
  }),

  // Test DB Manager
  tsConfig('test-db-manager/tsconfig.json', {
    files: ['test-db-manager/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true }),
    rules: nodeProjectRules,
  }),

  // Codegen
  tsConfig('codegen/tsconfig.json', {
    files: ['codegen/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true }),
    rules: nodeProjectRules,
  }),
);
