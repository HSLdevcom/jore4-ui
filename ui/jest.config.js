const tsconfig = require('./tsconfig');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '.(ts|tsx|json)': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules', 'src/utils'],
  testPathIgnorePatterns: ['node_modules', './cypress'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper,
};
