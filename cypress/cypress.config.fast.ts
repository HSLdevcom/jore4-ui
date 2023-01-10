// Performance optimized configurations to run e2e tests faster locally
import { defineConfig } from 'cypress';
import config from './cypress.config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    ...config.e2e,
  },
  env: {
    DISABLE_MAP_TILES: true,
  },
});
