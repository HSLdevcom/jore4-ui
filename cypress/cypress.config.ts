// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cypressGrepPlugin from '@cypress/grep/src/plugin';
import { defineConfig } from 'cypress';
import { onLaunchBrowser } from './support/launchBrowser';
import * as tasks from './support/tasks';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    // Update default file paths to strip `/cypress/` folder prefix
    supportFile: 'support/e2e.ts',
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
    setupNodeEvents(on, config) {
      on('task', tasks);
      on('before:browser:launch', onLaunchBrowser);

      cypressGrepPlugin(config);
    },
    env: process.env,
  },
});
