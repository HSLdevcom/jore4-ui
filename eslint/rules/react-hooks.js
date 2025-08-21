module.exports = {
  rules: {
    // Verify the list of the dependencies for Hooks like useEffect and similar
    // https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/rules/ExhaustiveDeps.ts
    'react-hooks/exhaustive-deps': 'error',
  },
};
