// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import { defineConfig } from 'cypress';
import { GenerateCtrfReport } from 'cypress-ctrf-json-reporter';
import cypressSplit from 'cypress-split';
import { CompositeCypressEventHandler } from './support/compositeEventHandler';
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
      const compositeEventHandler = new CompositeCypressEventHandler(on);

      const compositeOn = compositeEventHandler.on.bind(
        compositeEventHandler,
      ) as unknown as Cypress.PluginEvents;

      cypressSplit(compositeOn, config);

      on('task', tasks);
      on('before:browser:launch', onLaunchBrowser);
      if (process.env.JORE4_CYPRESS_GENERATE_CTRF_REPORT === 'true') {
        // eslint-disable-next-line no-new
        new GenerateCtrfReport({
          on: compositeOn,
          outputFile: 'ctrf-report.json',
          outputDir: 'ctrf',
          appName: 'JORE4',
        });
      }

      cypressGrepPlugin(config);

      return config;
    },
    env: process.env,
  },
});
