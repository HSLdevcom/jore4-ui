import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import confusingBrowserGlobals from 'confusing-browser-globals';

const restrictedGlobals = [
  {
    name: 'isFinite',
    message:
      'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
  },
  {
    name: 'isNaN',
    message:
      'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
  },

  ...confusingBrowserGlobals.map((g) => ({
    name: g,
    message: `Use window.${g} instead. https://github.com/facebook/create-react-app/blob/HEAD/packages/confusing-browser-globals/README.md`,
  })),
];

export const rules: SharedConfig.RulesRecord = {
  // disallow labels that share a name with a variable
  // https://eslint.org/docs/rules/no-label-var
  'no-label-var': 'error',

  // disallow specific globals
  'no-restricted-globals': ['error', ...restrictedGlobals],

  // disallow declaration of variables already declared in the outer scope
  'no-shadow': 'error',

  // disallow use of undefined when initializing variables
  'no-undef-init': 'error',

  // disallow use of variables before they are defined
  'no-use-before-define': [
    'error',
    { functions: true, classes: true, variables: true },
  ],
};
