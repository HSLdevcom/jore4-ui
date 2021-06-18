// https://hasura.io/learn/graphql/typescript-react-apollo/codegen/

module.exports = {
  schema: [
    {
      'http://localhost:8080/v1/graphql': {},
    },
  ],
  documents: ['./src/graphql/**/*.tsx', './src/graphql/**/*.ts'],
  overwrite: true,
  generates: {
    './src/generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};
