import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const resolveNodeModulesPlugin = nodeResolve({ exportConditions: ['node'] });
const commonJsPlugin = commonjs({
  include: ['./index.js', /node_modules/],
});
const tsPlugin = typescript({
  tsconfig: './tsconfig.json',
  compilerOptions: { declarationDir: './types' },
});

const commonPlugins = [resolveNodeModulesPlugin, commonJsPlugin, tsPlugin];

// Mark node modules as externals. Needed for knex's optional drivers.
const commonExternals = [/node_modules/];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: 'src/index.ts',

    external: commonExternals,
    output: [
      // es output from ts build (ts-dist) is needed for including
      // TS types (.d.ts files) to output
      {
        file: './ts-dist/index.js',
        format: 'es',
      },
      {
        file: 'dist/index.js',
        format: 'cjs', // commonJS
        sourcemap: true,
      },
      // not sure if we actually need esm build, but leaving it here for now
      // as it doesn't affect build time much at least at this point.
      {
        file: 'dist/index.mjs',
        format: 'esm', // ES Modules
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: 'src/seedTimetables.ts',
    external: commonExternals,
    output: [
      {
        file: 'dist/seedTimetables.js',
        format: 'cjs', // commonJS
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: 'src/seedStopRegistry.ts',
    external: commonExternals,
    output: [
      {
        file: 'dist/seedStopRegistry.js',
        format: 'cjs', // commonJS
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: 'src/seedStopRegistryTerminals.ts',
    external: commonExternals,
    output: [
      {
        file: 'dist/seedStopRegistryTerminals.js',
        format: 'cjs', // commonJS
        sourcemap: true,
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: './ts-dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
  {
    input: './src/CypressSpecExports.ts',
    output: [
      { file: './ts-dist/CypressSpecExports.js', format: 'es' },
      { file: 'dist/CypressSpecExports.js', format: 'cjs' },
    ],
    plugins: [nodeResolve({ browser: true }), commonJsPlugin, tsPlugin],
  },
  {
    input: './src/CypressSpecExports.ts',
    output: [{ file: 'dist/CypressSpecExports.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

// eslint-disable-next-line import/no-default-export
export default config;
