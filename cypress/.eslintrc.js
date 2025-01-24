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
        curly: ['error', 'all'], // Enforce consistent brace style for all control statements https://eslint.org/docs/latest/rules/curly
        // this rule is annoying with "page object" pattern
        'class-methods-use-this': 'off',
        // cypress runs tests with mocha instead of jest, so jest-specific rules make no sense.
        // TODO: rather disable whole 'plugin:jest/recommended' at once (but how?)
        'jest/expect-expect': 'off',
        'jest/valid-describe-callback': 'off',
        'cypress/no-pause': 'error',
      },
    },
  ],
};
