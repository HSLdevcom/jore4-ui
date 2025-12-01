module.exports = {
  rules: {
    // Verify the list of the dependencies for Hooks like useEffect and similar
    // https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/rules/ExhaustiveDeps.ts
    'react-hooks/exhaustive-deps': 'error',

    // Allow refs to be accessed in render bodies
    'react-hooks/refs': 0,

    // Allow calling setState in useEffect
    'react-hooks/set-state-in-effect': 0,

    // We are not using React Compiler, don't warn about react-hook-form
    'react-hooks/incompatible-library': 0,
  },
};
