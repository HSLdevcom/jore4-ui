import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';

export const rules: SharedConfig.RulesRecord = {
  'class-methods-use-this': 'off',
  'mocha/no-exclusive-tests': 'error',
  'mocha/no-pending-tests': 'error',
  'cypress/no-pause': 'error',
};
