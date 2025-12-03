import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const commonJsPlugin = commonjs({
  include: ['./index.js', /node_modules/],
});
const tsPlugin = typescript({
  tsconfig: './tsconfig.json',
  compilerOptions: {
    outDir: './dist',
    declarationDir: './dist/types',
  },
  outputToFilesystem: true,
});

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: 'src/index.ts',

    // Mark node modules as externals. Needed for knex's optional drivers.
    external: [/node_modules/],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      nodeResolve({ exportConditions: ['node'] }),
      commonJsPlugin,
      tsPlugin,
    ],
  },
  {
    input: './src/CypressSpecExports.ts',
    output: [
      { file: 'dist/CypressSpecExports.js', format: 'es', sourcemap: true },
    ],
    external: [/node_modules/],
    plugins: [nodeResolve({ browser: true }), commonJsPlugin, tsPlugin],
  },
];

// eslint-disable-next-line import/no-default-export
export default config;
