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

// @ts-expect-error not sure what is wrong here, something with cypress typings? "Argument of type '(this: Context, selector: string) => Chainable<JQuery<HTMLElement>>' is not assignable to parameter of type 'CommandFn<"getByTestId">', ..."
Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

// @ts-expect-error "Argument of type '() => Cypress.Chainable<null>' is not assignable to parameter of type 'CommandFn<"mockLogin">'."
Cypress.Commands.add('mockLogin', () => {
  cy.fixture('users/e2e.json').then((userInfo) => {
    cy.intercept('GET', '/api/auth/public/v1/userInfo', {
      statusCode: 200,
      body: userInfo,
    });
  });

  // TODO: we should match only '/api/graphql' requests, but for some
  // reason that doesn't seem to work. (Could be because our graphql
  // requests use ws:// protocol?)
  return cy.intercept('*', (req) => {
    // eslint-disable-next-line no-param-reassign
    req.headers['x-hasura-admin-secret'] = 'hasura';
  });
});
