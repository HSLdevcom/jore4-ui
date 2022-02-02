// https://hasura.io/learn/graphql/typescript-react-apollo/codegen/

module.exports = {
  schema: [
    {
      'http://localhost:3201/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'hasura',
        },
      },
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
        namingConvention: {
          transformUnderscore: true,
        },
        scalars: {
          uuid: 'UUID',
        },
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};
