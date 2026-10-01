import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';

export const rules: SharedConfig.RulesRecord = {
  // babel inserts `'use strict';` for us
  strict: ['error', 'never'],
};
