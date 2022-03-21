// https://hasura.io/learn/graphql/typescript-react-apollo/codegen/

module.exports = {
  schema: [
    {
      'http://localhost:3201/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'hasura',
        },
        loader: './schema-loader.js',
      },
    },
  ],
  documents: ['./src/graphql/**/*.tsx', './src/graphql/**/*.ts'],
  overwrite: true,
  generates: {
    './src/generated/graphql.tsx': {
      plugins: [
        {
          // importing luxon to be able to use its DateTime type
          add: {
            content: "import * as luxon from 'luxon';",
          },
        },
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
          geography: 'GeoJSON.Geometry',
          geometry: 'GeoJSON.Geometry',
          geography_point: 'GeoJSON.Point',
          geography_linestring: 'GeoJSON.LineString',
          timestamptz: 'luxon.DateTime',
        },
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};
