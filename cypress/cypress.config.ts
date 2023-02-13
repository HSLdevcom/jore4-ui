import {
  getDbConnection,
  truncateDb,
  hasuraApi,
  insertVehicleSubmodeOnInfraLink,
  removeVehicleSubmodeOnInfraLink,
} from '@hsl/jore4-test-db-manager';
import { defineConfig } from 'cypress';
import * as fs from 'fs';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  e2e: {
    // Update default file paths to strip `/cypress/` folder prefix
    supportFile: 'support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'fixtures',
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    video: false,
    defaultCommandTimeout: 20000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    requestTimeout: 20000,
    numTestsKeptInMemory: 5,
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
      const db = getDbConnection();
      // Insert infralinks before test run starts
      on('before:run', () => {
        const infraLinksQuery = fs
          .readFileSync('./fixtures/infraLinks/infraLinks.sql')
          .toString();
        return db.raw(infraLinksQuery);
      });
      on('task', {
        async checkDbConnection() {
          // Example about direct access to db
          return (
            db
              .raw('SELECT 1')
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((res: any) => {
                // eslint-disable-next-line no-console
                console.log('PostgreSQL connected', res);
                return res;
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((e: any) => {
                // eslint-disable-next-line no-console
                console.log('PostgreSQL not connected');
                // eslint-disable-next-line no-console
                console.error(e);
                // We have to return undefined instead of throwing an error
                // in order to make test fail if we end up to this code block.
                // https://docs.cypress.io/api/commands/task#Usage
                return undefined;
              })
          );
        },
        async truncateDb() {
          return truncateDb(db);
        },
        async executeRawDbQuery({ query, bindings }) {
          return db.raw(query, bindings);
        },
        async hasuraApi(request) {
          return hasuraApi(request);
        },
        // Note: next 2 functions exists only because name of table
        // 'infrastructure_network.vehicle_submode_on_infrastructure_link'
        // is too long for hasura to handle. Generally db
        // should be accessed through "hasuraApi" function and this kind
        // of specific functions should be avoided.
        async insertVehicleSubmodOnInfraLinks(request) {
          return insertVehicleSubmodeOnInfraLink(db, request);
        },
        async removeVehicleSubmodOnInfraLinks(request) {
          return removeVehicleSubmodeOnInfraLink(db, request);
        },
      });
    },
  },
});
