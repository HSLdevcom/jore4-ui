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

const {
  getDbConnection,
  truncateDb,
  hasuraApi,
  insertVehicleSubmodeOnInfraLink,
  removeVehicleSubmodeOnInfraLink,
} = require('@hsl/jore4-test-db-manager');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (on, config) => {
  const db = getDbConnection();
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    async checkDbConnection() {
      // Example about direct access to db
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
};
