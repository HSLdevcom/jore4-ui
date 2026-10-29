import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';

export const rules: SharedConfig.RulesRecord = {
  'class-methods-use-this': 'off',
  'cypress/no-pause': 'error',
  'jest/no-disabled-tests': 'error',
  'jest/no-focused-tests': 'error',
};
