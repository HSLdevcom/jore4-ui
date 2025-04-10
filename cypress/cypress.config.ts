import { defineConfig } from 'cypress';
import * as tasks from './e2e/utils/tasks';
import { onLaunchBrowser } from './support/launchBrowser';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    // Update default file paths to strip `/cypress/` folder prefix
    supportFile: 'support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'fixtures',
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    downloadsFolder: 'downloads',
    video: false,
    defaultCommandTimeout: 20000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    requestTimeout: 20000,
    numTestsKeptInMemory: Number(process.env.CYPRESS_TESTS_KEPT_IN_MEMORY) || 5,
    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 2,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    },
    experimentalInteractiveRunEvents: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      on('task', tasks);
      on('before:browser:launch', onLaunchBrowser);
    },
    env: process.env,
  },
});
