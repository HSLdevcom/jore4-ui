// Performance optimized configurations, like disabling video
// recording and map tiles for faster e2e test runs.
import { defineConfig } from 'cypress';
import config from './cypress.config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    ...config.e2e,
    video: false,
  },
  env: {
    DISABLE_MAP_TILES: true,
  },
});
