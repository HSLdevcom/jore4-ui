import type { CodegenConfig } from '@graphql-codegen/cli';
import module from 'node:module';
import tsNode from 'ts-node';

// Register TsNode into node so that we can load Ts based plugins
tsNode.register({ transpileOnly: true });

// Based on
// https://github.com/dotansimha/graphql-code-generator/blob/62c76188d4e660efa50dcf486921804adc70e1b5/packages/graphql-codegen-cli/src/codegen.ts#L31
const relativeRequire = module.createRequire(__filename);
async function pluginLoader(name: string) {
  try {
    return relativeRequire(name);
  } catch {
    return import(name);
  }
}

// https://hasura.io/learn/graphql/typescript-react-apollo/codegen/

const baseScalars = {
  uuid: 'UUID',
  geography: 'GeoJSON.Geometry',
  geometry: 'GeoJSON.Geometry',
  geography_point: 'GeoJSON.Point',
  geography_linestring: 'GeoJSON.LineString',
  localized_string: 'LocalizedString',
  stop_registry_Coordinates: 'GeoJSON.Position',
  float8: 'number',
  smallint: 'number',
};

// Dates are also accepted as ISO date strings (`YYYY-MM-DD`) in query
// variables. Apollo compares variables by value, and two distinct but equal
// `Temporal.PlainDate`s are never equal, so a string keeps the variables stable.
const uiScalars = {
  ...baseScalars,
  timestamptz: 'Temporal.ZonedDateTime',
  date: { input: 'Temporal.PlainDate | string', output: 'Temporal.PlainDate' },
  interval: 'Temporal.Duration',
  stop_registry_DateTime: 'Temporal.ZonedDateTime',
  stop_registry_LocalDate: {
    input: 'Temporal.PlainDate | string',
    output: 'Temporal.PlainDate',
  },
};

// The test code (test-db-manager and cypress) has been fully migrated to Temporal.
//
// Inputs are built in Cypress spec code (the browser) and in Node, but a part
// of them is passed to the database through `cy.task`, which serializes its
// arguments with `JSON.stringify`. Temporal values therefore reach the Node
// side as strings, and both forms have to be allowed. `StripTemporalTypes` and
// `StripSerializedTypes` can be used to pick the form that is in use at hand.
//
// Query results come straight from `JSON.parse`, so every scalar that Temporal
// models is a string on the way out.
const testScalars = {
  ...baseScalars,
  date: { input: 'Temporal.PlainDate | string', output: 'string' },
  stop_registry_LocalDate: {
    input: 'Temporal.PlainDate | string',
    output: 'string',
  },
  interval: { input: 'Temporal.Duration | string', output: 'string' },
  timestamptz: { input: 'Temporal.ZonedDateTime | string', output: 'string' },
  stop_registry_DateTime: {
    input: 'Temporal.ZonedDateTime | string',
    output: 'string',
  },
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

const config: CodegenConfig = {
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
      documents: [
        '../ui/src/**/*.tsx',
        '../ui/src/**/*.ts',
        '../ui/src/**/*.graphql',
      ],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        ...defaultConfig,
        withHooks: true,
        immutableTypes: true,
        documentMode: 'documentNode',
        scalars: uiScalars,
      },
    },
    '../test-db-manager/src/generated/graphql.ts': {
      documents: ['../test-db-manager/src/**/*.ts'],
      plugins: ['typescript', 'typescript-operations'],
      config: {
        ...defaultConfig,
        withHooks: false,
        scalars: testScalars,
      },
    },
    '../ui/graphql.schema.json': {
      plugins: ['introspection'],
    },
    // Create a list of Tiamat entities that are versioned,
    // for easy registration in Apollo cache config.
    '../ui/src/generated/versionedTiamatEntities.ts': {
      plugins: ['./TiamatVersionedObjectTypesResolverPlugin.ts'],
    },
  },
  // Use ts-node as the require method for the schema and plugin loaders
  require: ['ts-node/register/transpile-only'],
  pluginLoader,
};

// eslint-disable-next-line import-x/no-default-export
export default config;
