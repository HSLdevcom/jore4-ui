module.exports = {
  rules: {
    // Static analysis:

    // Helpful warnings:

    // do not allow a default import name to match a named export
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default.md
    'import/no-named-as-default': 'error',

    // warn on accessing default export property names that are also named exports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default-member.md
    'import/no-named-as-default-member': 'error',

    // Forbid the use of extraneous packages
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
    // paths are treated both as absolute paths, and relative to process.cwd()
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx}', // repos with a single test file
          'test-*.{js,jsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.js', // jest config
          '**/jest.setup.js', // jest setup
          '**/vue.config.js', // vue-cli config
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          '**/rollup.config.js', // rollup config
          '**/rollup.config.*.js', // rollup config
          '**/gulpfile.js', // gulp config
          '**/gulpfile.*.js', // gulp config
          '**/Gruntfile{,.js}', // grunt config
          '**/protractor.conf.js', // protractor config
          '**/protractor.conf.*.js', // protractor config
          '**/karma.conf.js', // karma config
          '**/.eslintrc.js', // eslint config
        ],
        optionalDependencies: false,
      },
    ],

    // Forbid mutable exports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
    'import/no-mutable-exports': 'error',

    // Module systems:

    // disallow require()
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-commonjs.md
    'import/no-commonjs': 'error',

    // disallow AMD require/define
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-amd.md
    'import/no-amd': 'error',

    // Style guide:

    // disallow non-import statements appearing before import statements
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
    'import/first': 'error',

    // disallow duplicate imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
    'import/no-duplicates': 'error',

    // Ensure consistent use of file extension within the import path
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
      },
    ],

    // ensure absolute imports are above relative imports and that unassigned imports are ignored
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      { groups: [['builtin', 'external', 'internal']] },
    ],

    // Require a newline after the last import/require in a group
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
    'import/newline-after-import': 'error',

    // Require modules with a single export to use a default export
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'error',

    // Forbid import of modules using absolute paths
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md
    'import/no-absolute-path': 'error',

    // Forbid require() calls with expressions
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-dynamic-require.md
    'import/no-dynamic-require': 'error',

    // Forbid Webpack loader syntax in imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-webpack-loader-syntax.md
    'import/no-webpack-loader-syntax': 'error',

    // Prevent importing the default as if it were named
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-default.md
    'import/no-named-default': 'error',

    // Forbid a module from importing itself
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md
    'import/no-self-import': 'error',

    // Forbid cyclical dependencies between modules
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
    'import/no-cycle': ['error', { maxDepth: '∞' }],

    // Ensures that there are no useless path segments
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
    'import/no-useless-path-segments': ['error', { commonjs: true }],

    // Reports the use of import declarations with CommonJS exports in any module except for the main module.
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-import-module-exports.md
    'import/no-import-module-exports': [
      'error',
      {
        exceptions: [],
      },
    ],

    // Use this rule to prevent importing packages through relative paths.
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md
    'import/no-relative-packages': 'error',
  },
};
