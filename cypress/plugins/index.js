/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This file runs code in node.js environment.

// import statements are not supported for some reason.
/* eslint-disable @typescript-eslint/no-var-requires */

const { getDbConnection, truncateDb } = require('@hsl/jore4-test-db-manager');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    async checkDbConnection() {
      // Example about direct access to db
      const db = getDbConnection();
      return db
        .raw('SELECT 1')
        .then((res) => {
          // eslint-disable-next-line no-console
          console.log('PostgreSQL connected', res);
          return res;
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log('PostgreSQL not connected');
          // eslint-disable-next-line no-console
          console.error(e);
          // We have to return undefined instead of throwing an error
          // in order to make test fail if we end up to this code block.
          // https://docs.cypress.io/api/commands/task#Usage
          return undefined;
        });
    },
    async truncateDb() {
      const db = getDbConnection();
      return truncateDb(db);
    },
  });
};
