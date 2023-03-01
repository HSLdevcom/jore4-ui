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

Cypress.Commands.add('mockLogin', () => {
  cy.fixture('users/e2e.json').then((userInfo) => {
    // return a mock user info instead of going for the auth backend
    cy.intercept('GET', '/api/auth/public/v1/userInfo', {
      statusCode: 200,
      body: userInfo,
    }).as('userInfo');

    // intercept calls to hasura and log in as admin (to avoid it going to auth backend)
    // TODO: we should match only '/api/graphql' requests, but for some
    // reason that doesn't seem to work. (Could be because our graphql
    // requests use ws:// protocol?)
    cy.intercept('**', (req) => {
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
    cy.intercept('https://api.digitransit.fi/**', {
      statusCode: 404,
      body: '404 Not Found!',
    }).as('blockDigitransit');
    cy.intercept('https://digitransit-dev-cdn-origin.azureedge.net/**', {
      statusCode: 404,
      body: '404 Not Found!',
    }).as('blockDigitransit');
  }

  // label all graphql calls that they can be expected in tests
  // e.g. GetAllLines query can be waited as cy.wait('@gqlGetAllLines')
  cy.intercept('POST', '/api/graphql/**', (req) => {
    if (req.body && req.body.operationName) {
      // eslint-disable-next-line no-param-reassign
      req.alias = `gql${req.body.operationName}`;
      // default instance = thread4, e2e1 = thread1, etc
      const currentExecutorIndex = Cypress.env('THREAD') || '4';
      Cypress.log({
        message: `UI Hasura executor index, ${currentExecutorIndex}`,
      });
      // eslint-disable-next-line no-param-reassign
      req.headers['X-Environment'] = `e2e${currentExecutorIndex}`;
      req.continue();
    }
  });

  cy.intercept('/api/mapmatching/api/route/v1/**').as('mapMatching');
});

// workaround for 'commands.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {};
