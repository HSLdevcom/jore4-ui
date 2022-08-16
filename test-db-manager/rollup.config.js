import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: 'src/index.ts',
    // had to define cross-fetch as external to get rid of rollup build error.
    external: ['cross-fetch', 'cross-fetch/polyfill'],
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
    plugins: [
      nodeResolve(),
      commonjs({
        include: ['./index.js', /node_modules/],
      }),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: { declarationDir: './types' },
      }),
    ],
  },
  {
    input: './ts-dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

// eslint-disable-next-line import/no-default-export
export default config;
