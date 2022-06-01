import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
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
    nodeResolve({
      // browser: true,
    }),
    commonjs({ include: ['./index.js', 'node_modules/**'] }),
    typescript(),
  ],
};

// eslint-disable-next-line import/no-default-export
export default config;
