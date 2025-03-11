// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { HasuraEnvironment } from '@hsl/jore4-test-db-manager';
import type { DateTime } from 'luxon';
import { mockMapTileServerReponses } from './mockMapTileServerReponses';

const getHasuraEnvironment = () => {
  if (Cypress.env('CI') === undefined && Cypress.env('CYPRESS') === 'true') {
    return HasuraEnvironment.e2e;
  }
  return HasuraEnvironment.default;
};

Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: true },
  (subject, selector) => {
    // NOTE: `find` is "child" command and thus has to be defined differently than
    // "parent" commands. See cypress docs for more info: https://docs.cypress.io/api/cypress-api/custom-commands#Child-Commands
    return cy.wrap(subject).find(`[data-testid="${selector}"]`);
  },
);

Cypress.Commands.add('clearAndType', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).clear();
  cy.wrap(subject).type(text);
  return cy.wrap(subject);
});

Cypress.Commands.add(
  'inputDateValue',
  { prevSubject: true },
  (subject, date: DateTime<true>) => {
    cy.wrap(subject).clear();
    cy.wrap(subject).type(date.toISODate());
    return cy.wrap(subject);
  },
);

Cypress.Commands.add(
  'shouldHaveText',
  { prevSubject: true },
  (subject, expectedText) => {
    cy.wrap(subject).should('have.text', expectedText);
  },
);

Cypress.Commands.add('shouldBeVisible', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('be.visible');
});

Cypress.Commands.add('shouldBeDisabled', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('be.disabled');
});

Cypress.Commands.add('mockLogin', () => {
  cy.fixture('users/e2e.json').then((userInfo) => {
    // return a mock user info instead of going for the auth backend
    cy.intercept('GET', '/api/auth/public/v1/userInfo', {
      statusCode: 200,
      body: userInfo,
    }).as('userInfo');

    // intercept calls to hastus service
    // and log in as admin (to avoid it going to auth backend)
    cy.intercept('/api/hastus/**', (req) => {
      // eslint-disable-next-line no-param-reassign
      req.headers['x-hasura-admin-secret'] = 'hasura';
    }).as('hastusAuth');

    // intercept calls to hasura
    // and log in as admin (to avoid it going to auth backend)
    cy.intercept('/api/graphql/**', (req) => {
      // eslint-disable-next-line no-param-reassign
      req.headers['x-hasura-admin-secret'] = 'hasura';
    }).as('hasuraAuth');
  });
});

Cypress.Commands.add('setupTests', () => {
  // In CI, the tests run faster and more reliably if we don't show the map tiles.
  // However the map tiles might come handy when running these tests locally.
  if (Cypress.env('DISABLE_MAP_TILES')) {
    Cypress.log({ message: 'Disabling map tile rendering' });
    mockMapTileServerReponses();
  }

  // label all graphql calls that they can be expected in tests
  // e.g. GetAllLines query can be waited as cy.wait('@gqlGetAllLines')
  cy.intercept('POST', '/api/graphql/**', (req) => {
    if (
      typeof req.body === 'object' &&
      typeof req.body?.operationName === 'string'
    ) {
      // eslint-disable-next-line no-param-reassign
      req.alias = `gql${req.body.operationName}`;

      const hasuraEnvironment = getHasuraEnvironment();

      Cypress.log({
        message: `Hasura environment for GraphQL, ${hasuraEnvironment}`,
      });
      // eslint-disable-next-line no-param-reassign
      req.headers['X-Environment'] = hasuraEnvironment;
    }

    req.continue();
  });

  cy.intercept('POST', '/api/hastus/import', (req) => {
    // eslint-disable-next-line no-param-reassign
    req.alias = 'hastusImport';

    const hasuraEnvironment = getHasuraEnvironment();

    Cypress.log({
      message: `Hasura environment for import, ${hasuraEnvironment}`,
    });
    // eslint-disable-next-line no-param-reassign
    req.headers['x-Environment'] = hasuraEnvironment;
    req.continue();
  });

  cy.intercept('POST', '/api/hastus/export/**', (req) => {
    // eslint-disable-next-line no-param-reassign
    req.alias = 'hastusExport';

    const hasuraEnvironment = getHasuraEnvironment();

    Cypress.log({
      message: `Hasura environment for export, ${hasuraEnvironment}`,
    });
    // eslint-disable-next-line no-param-reassign
    req.headers['x-Environment'] = hasuraEnvironment;
    req.continue();
  });

  cy.intercept('/api/mapmatching/api/route/v1/**').as('mapMatching');
});

// workaround for 'commands.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {};
