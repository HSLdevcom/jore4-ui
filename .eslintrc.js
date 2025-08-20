const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:i18n-json/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    './eslint/airbnb/index.js',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:jest-formatting/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'jest',
    'jest-formatting',
    'lodash',
  ],
  ignorePatterns: [
    'ui/src/generated/*.tsx',
    'ui/jest.setup.ts',
    'test-db-manager/src/generated/*.ts',
    'test-db-manager/dist',
    'test-db-manager/ts-dist',
    'jore4-hasura',
  ],
  rules: {
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'], // Enforce consistent brace style for all control statements https://eslint.org/docs/latest/rules/curly
    'arrow-body-style': 'off', // allow writing arrow functions like () => { return ... } instead of forcing those to be () => (...)
    'no-use-before-define': 'off', // note you must disable the base rule as it can report incorrect errors: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    '@typescript-eslint/no-use-before-define': 'error', // require variables to be used before defined
    'import/prefer-default-export': 'off', // default exports are bad, prefer named exports: https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/no-default-export': 'error', // default exports are bad, prefer named exports
    '@typescript-eslint/explicit-module-boundary-types': 'off', // don't require explicit return values for functions as usually TS can infer those
    'no-param-reassign': [
      'error',
      // ignore 'draft' as its convention to use that name with immer: https://immerjs.github.io/immer/
      // ignore 'state' as `redux-toolkit` handles state modifications with `immer`
      { props: true, ignorePropertyModificationsFor: ['draft', 'state'] },
    ],
    'no-shadow': 'off', // this might report false positives with TS: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md#how-to-use
    '@typescript-eslint/no-shadow': ['error'], //
    'no-unused-expressions': ['error', { allowTernary: true }], // allow expressions like `booleanValue ? doSomething() : doSomethingElse()`
    'react/forbid-component-props': [
      'error',
      {
        forbid: [
          // catch common misspelling that can cause errors
          { propName: 'data-testId', message: 'Should be "data-testid"' },
        ],
      },
    ],
    'react/forbid-dom-props': [
      'error',
      {
        forbid: [
          { propName: 'data-testId', message: 'Should be "data-testid"' },
        ],
      },
    ],
    'react/require-default-props': 'off', // default props are going to be deprecated in function components (https://github.com/reactjs/rfcs/pull/107) so it doesn't make sense to enforce them. Use e.g. default values instead.
    'react/prop-types': 'off', // not needed with TypeScript as it checks type compatability already on compile time based
    'react/function-component-definition': [
      // enforce consistent react component definitions
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-filename-extension': [
      // require jsx to be in TS files. For some reason both .tsx and .ts extensions need to be listed here, but this will still complain if it finds .jsx in .ts file
      'error',
      { extensions: ['.tsx', '.ts'] },
    ],
    'react/jsx-props-no-spreading': [
      'error',
      // allow spreading props in...
      // - form-related fields as it seems to be convention
      //   with `react-hook-form`'s `register` method: https://react-hook-form.com/get-started
      // - in certain `react-map-gl` related components as it seems to be
      //   convention also with those: https://visgl.github.io/react-map-gl/docs/api-reference/layer
      { exceptions: ['input', 'textarea', 'Layer'] },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      // prevent importing .ts/.tsx files with file extension
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      // allow importing dev dependencies in test files
      {
        devDependencies: [
          '**/*.spec.ts',
          '**/*.spec.tsx',
          './ui/src/utils/test-utils/**',
        ],
      },
    ],
    // Sort members of each import, since import/order rule does not take care of that.
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      // require imports to be sorted like vscode automatically does with its "organize imports" feature.
      // https://code.visualstudio.com/docs/languages/typescript#_organize-imports
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
        groups: [
          ['external', 'builtin'],
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
      },
    ],
    'eslint-comments/no-unused-disable': 'error', // ban unused eslint-disable comments
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        // if eslint rules are disabled in the beginning of file, it usually means that it is done for a reason and it doesn't make sense to enable those again at the end of the file
        allowWholeFile: true,
      },
    ],
    // Disabled as this provides mostly cosmetic value but causes typing errors
    // instead. Due to current react typings we can't `return null`
    // (or undefined) for components when we don't want to render anything, and
    // this rule disallows also workaround of returning empty fragment
    // (`return <></>`)
    'react/jsx-no-useless-fragment': 'off',
    'lodash/import-scope': ['error', 'method'], // prefer importing individual lodash methods (e.g. `import map from 'lodash/map'` instead of whole lodash library (`import { map } from 'lodash'`) to minimize bundle size
    'react/react-in-jsx-scope': 'off', // not needed with next.js: https://stackoverflow.com/a/61160875
    'i18n-json/sorted-keys': 'off',
    'i18n-json/valid-message-syntax': 'off', // Seems to be a bit broken currently.
    'i18n-json/identical-keys': [
      'error',
      {
        filePath: {
          'common.json': path.resolve('./ui/src/locales/fi-FI/common.json'),
          'accessibility.json': path.resolve(
            './ui/src/locales/fi-FI/accessibility.json',
          ),
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^GQL' },
    ], // ignore graphql query/mutation/fragment definitions
    'no-plusplus': 'off', // this rule is stupid. For loops should be able to use i++

    // Previously enabled by-default by the recommended rule set.
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-empty-function': 'error',
  },
  overrides: [
    // These overrides enable prefer-nullish-coalescing rule for TypeScript files.
    // These options and rules need to be enabled for ts files only, as otherwise
    // errors will be generated, when linting JSON files.
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
      },
    },
  ],
};
