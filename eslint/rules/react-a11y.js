// Overrides to eslint-plugin-jsx-a11y recommended config

module.exports = {
  rules: {
    // Reason: Added <Link to> comp+prop
    // ensure <a> tags are valid
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      { components: ['Link'], specialLink: ['to'] },
    ],

    // Reason: Enabled in recommended conf → Should be enabled?
    // Ensure the autocomplete attribute is correct and suitable for the form field it is used with
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/autocomplete-valid.md
    'jsx-a11y/autocomplete-valid': ['off', { inputComponents: [] }],

    // Reason: Custom label attr and deeper depth
    // Enforce that a control (an interactive element) has a text label.
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        labelAttributes: ['label'],
        ignoreElements: [
          'audio',
          'canvas',
          'embed',
          'input',
          'textarea',
          'tr',
          'video',
        ],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 5,
      },
    ],

    // Reason: Enabled
    // require HTML element's lang prop to be valid
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
    'jsx-a11y/lang': 'error',

    // Reason: Allow autoFocus prop on non DOM nodes
    // prohibit autoFocus prop
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],

    // Reason: Default config allows ternaries → Should we allow ternaries `role={foo ? 'button' : 'link'}`?
    // Enforce that DOM elements without semantic behavior not have interaction handlers
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
  },
};
