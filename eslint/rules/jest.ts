import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';

export const rules: SharedConfig.RulesRecord = {
  // Old recommended config from the original jest-formatting plugin
  'jest/padding-around-after-all-blocks': 'error',
  'jest/padding-around-after-each-blocks': 'error',
  'jest/padding-around-before-all-blocks': 'error',
  'jest/padding-around-before-each-blocks': 'error',
  'jest/padding-around-describe-blocks': 'error',
  'jest/padding-around-test-blocks': 'error',
};
