module.exports = {
  extends: ['plugin:cypress/recommended'],
  overrides: [
    {
      files: ['**'],
      env: {
        // cypress runs tests with mocha instead of jest
        mocha: true,
      },
      rules: {
        // this rule is annoying with "page object" pattern
        'class-methods-use-this': 'off',
        // cypress runs tests with mocha instead of jest, so jest-specific rules make no sense.
        // TODO: rather disable whole 'plugin:jest/recommended' at once (but how?)
        'jest/expect-expect': 'off',
      },
    },
  ],
};
