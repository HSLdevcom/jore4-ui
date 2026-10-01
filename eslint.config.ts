import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import stylistic from '@stylistic/eslint-plugin';
import configPrettier from 'eslint-config-prettier/flat';
import cypress from 'eslint-plugin-cypress';
import importPlugin from 'eslint-plugin-import-x';
import lodash from 'eslint-plugin-lodash';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import n from 'eslint-plugin-n';
import react from '@eslint-react/eslint-plugin';
import eslintReactKit from '@eslint-react/kit';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';
import {
  uiRules,
  unitTestRules,
  cypressRules,
  nodeProjectRules,
  kits,
} from './eslint/rules';

function useKits() {
  return kits
    .reduce((chain, kit) => chain.use(kit), eslintReactKit())
    .getConfig();
}

/**
 * @param {boolean} useReact
 * @param {boolean} useNode
 * @param {boolean} useJest
 * @param {boolean} useCypress
 * @return {Array<InfiniteDepthConfigWithExtends>}
 */
function getExtends({
  react: useReact = false,
  node: useNode = false,
  jest: useJest = false,
  cypress: useCypress = false,
} = {}): Array<InfiniteDepthConfigWithExtends> {
  return [
    js.configs.recommended,

    ...(useReact
      ? [
          react.configs['recommended-typescript'],
          useKits(),
          jsxA11y.configs['recommended'],
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
      'eslint.config.ts',
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
      node: { version: '>=24' },
    },
    plugins: {
      // Other plugins get automatically added in by the shared configs (extends)
      '@stylistic': stylistic,
      js,
      lodash,
    },
  },

  // ESLint config bits
  {
    files: ['eslint/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true }),
    rules: nodeProjectRules,
  },

  // UI code
  {
    files: ['ui/**/*.{ts,tsx}'],
    ignores: ['ui/**/*.spec.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: getExtends({ react: true }),
    rules: uiRules,
  },

  // Jest based unit/integration tests in UI dir
  {
    files: ['ui/**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    extends: getExtends({ react: true, node: true, jest: true }),
    rules: unitTestRules,
  },

  // Cypress
  {
    files: ['cypress/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true, cypress: true }),
    rules: cypressRules,
  },

  // Test DB Manager
  {
    files: ['test-db-manager/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true }),
    rules: nodeProjectRules,
  },

  // Codegen
  {
    files: ['codegen/**/*.ts'],
    languageOptions: { globals: globals.node },
    extends: getExtends({ node: true }),
    rules: nodeProjectRules,
  },
);
