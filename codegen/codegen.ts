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
        documentMode: 'documentNode',
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
    // Create a list of Tiamat entities that are versioned,
    // for easy registration in Apollo cache config.
    '../ui/src/generated/versionedTiamatEntities.json': {
      plugins: ['./TiamatVersionedObjectTypesResolverPlugin.ts'],
    },
  },
  // Use ts-node as the require method for the schema and plugin loaders
  require: ['ts-node/register/transpile-only'],
  pluginLoader,
};

// eslint-disable-next-line import/no-default-export
export default config;
