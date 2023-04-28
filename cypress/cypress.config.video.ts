import { defineConfig } from 'cypress';
import config from './cypress.config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    ...config.e2e,
    video: true,
    // Bigger video files but faster runs because compression is skipped
    videoCompression: false,
  },
});
