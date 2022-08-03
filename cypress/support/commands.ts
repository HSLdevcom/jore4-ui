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

Cypress.Commands.add('mockLogin', () => {
  cy.fixture('users/e2e.json').then((userInfo) => {
    cy.intercept('GET', '/api/auth/public/v1/userInfo', {
      statusCode: 200,
      body: userInfo,
    }).as('userInfo');

    cy.intercept('**', (req) => {
      // eslint-disable-next-line no-param-reassign
      req.headers['x-hasura-admin-secret'] = 'hasura';
    }).as('hasuraAuth');
  });
});

// workaround for 'commands.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {};
