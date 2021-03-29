module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
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
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    'import/no-default-export': 'error', // default exports are bad, prefer named exports: https://basarat.gitbook.io/typescript/main-1/defaultisbad
    '@typescript-eslint/explicit-module-boundary-types': 'off', // don't require explicit return values for functions as usually TS can infer those
    'react/react-in-jsx-scope': 'off', // not needed with next.js: https://stackoverflow.com/a/61160875
    'react-hooks/rules-of-hooks': 'error', // enforce best practices with react hoooks
    'react-hooks/exhaustive-deps': 'error', // enforce best practices with react hoooks: https://github.com/facebook/create-react-app/issues/6880#issuecomment-485912528
  },
};
