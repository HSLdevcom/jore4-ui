const { createDefaultPreset } = require('ts-jest');

module.exports = {
  ...createDefaultPreset({
    tsconfig: 'tsconfig.test.json',
    diagnostics: {
      // Needed to suppress an error with TS6.
      // See https://github.com/kulshekhar/ts-jest/pull/5273 and related,
      // for further steps, once a proper fix gets added.
      ignoreCodes: [5107],
    },
  }),
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules', 'src/utils'],
  testPathIgnorePatterns: ['node_modules', './cypress'],
};
