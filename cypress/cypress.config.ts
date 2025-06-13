// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cypressGrepPlugin from '@cypress/grep/src/plugin';
import { defineConfig } from 'cypress';
import { GenerateCtrfReport } from 'cypress-ctrf-json-reporter';
import cypressSplit from 'cypress-split';
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
      // Hanler for task event needs to be an object and as there is no multiple handlers
      // currently registering to task event, the handler is registered directly using on
      // callback.
      on('task', tasks);

      // handlers map and compositeOn function implement composite pattern (https://en.wikipedia.org/wiki/Composite_pattern)
      // to allow multiple event handlers to receive events from the same Cypress event.
      // Currently (2025-06) cypress-split and cypress-ctrf-reporter both are registering to
      // after:run event but the implementation allows any events to have multiple listeners.
      const handlers = new Map();

      const compositeOn = function(
        event,
        handler,
      ) {
          const eventHandlers = handlers.get(event);

          if (eventHandlers) {
            eventHandlers.push(handler);
          }
          else {
            handlers.set(event, [handler]);
          }
      };

      cypressSplit(compositeOn, config);

      compositeOn('before:browser:launch', onLaunchBrowser);
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

      for (const [event, eventHandlers] of handlers.entries()) {
        on(
          event,
          (...args: any[]) => {
            eventHandlers.forEach((handler) => {
              handler(...args);
            });
          },
        );
      }

      return config;
    },
    env: process.env,
  },
});
