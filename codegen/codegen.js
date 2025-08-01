// https://hasura.io/learn/graphql/typescript-react-apollo/codegen/

const scalars = {
  uuid: 'UUID',
  geography: 'GeoJSON.Geometry',
  geometry: 'GeoJSON.Geometry',
  geography_point: 'GeoJSON.Point',
  geography_linestring: 'GeoJSON.LineString',
  localized_string: 'LocalizedString',
  timestamptz: 'luxon.DateTime',
  date: 'luxon.DateTime',
  interval: 'luxon.Duration',
  stop_registry_DateTime: 'luxon.DateTime',
  stop_registry_Coordinates: 'GeoJSON.Position',
  float8: 'number',
  smallint: 'number',
};

const defaultConfig = {
  skipTypename: false,
  withHOC: false,
  withComponent: false,
  namingConvention: {
    transformUnderscore: true,
  },
  printFieldsOnNewLines: true,
};

const luxonImportPlugin = {
  // importing luxon to be able to use its DateTime type
  // using the "add" plugin to inject text to the beginning of the generated file
  add: {
    content: "import * as luxon from 'luxon';",
  },
};

module.exports = {
  schema: [
    {
      'http://127.0.0.1:3201/v1/graphql': {
        headers: {
          'x-hasura-admin-secret': 'hasura',
        },
        loader: './schemaLoader.ts',
      },
    },
  ],
  overwrite: true,
  generates: {
    '../ui/src/generated/graphql.tsx': {
      documents: ['../ui/src/**/*.tsx', '../ui/src/**/*.ts'],
      plugins: [
        luxonImportPlugin,
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        ...defaultConfig,
        withHooks: true,
        immutableTypes: true,
        scalars,
      },
    },
    '../test-db-manager/src/generated/graphql.ts': {
      documents: ['../test-db-manager/src/**/*.ts'],
      plugins: [luxonImportPlugin, 'typescript', 'typescript-operations'],
      config: {
        ...defaultConfig,
        withHooks: false,
        scalars,
      },
    },
    '../ui/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  // if dealing with a typescript plugin or schema loader, transpile it to javascript first
  require: ['ts-node/register/transpile-only'],
};
