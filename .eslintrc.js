module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
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
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jest'],
  rules: {
    'arrow-body-style': 'off', // allow writing arrow functions like () => { return ...} instead of forcing those to be () => (...)
    'no-use-before-define': 'off', // note you must disable the base rule as it can report incorrect errors: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    '@typescript-eslint/no-use-before-define': 'error', // require variables to be used before defined
    'import/prefer-default-export': 'off', // default exports are bad, prefer named exports: https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/no-default-export': 'error', // default exports are bad, prefer named exports
    '@typescript-eslint/explicit-module-boundary-types': 'off', // don't require explicit return values for functions as usually TS can infer those
    'no-shadow': 'off', // this might report false positives with TS: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md#how-to-use
    '@typescript-eslint/no-shadow': ['error'],
    'react/prop-types': 'off', // not needed with TypeScript as it checks type compatability already on compile time based
    'react/jsx-filename-extension': [
      // require jsx to be in TS files. For some reason both .tsx and .ts extensions need to be listed here, but this will still complain if it finds .jsx in .ts file
      'error',
      { extensions: ['.tsx', '.ts'] },
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
      { devDependencies: ['**/*.spec.ts', '**/*.spec.tsx'] },
    ],
    'import/order': [
      // require imports to be sorted like vscode automatically does with its "organize imports" feature.
      // https://code.visualstudio.com/docs/languages/typescript#_organize-imports
      'error',
      {
        alphabetize: {
          order: 'asc',
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
    'react/react-in-jsx-scope': 'off', // not needed with next.js: https://stackoverflow.com/a/61160875
    'react-hooks/rules-of-hooks': 'error', // enforce best practices with react hoooks
    'react-hooks/exhaustive-deps': 'error', // enforce best practices with react hoooks: https://github.com/facebook/create-react-app/issues/6880#issuecomment-485912528
  },
};
