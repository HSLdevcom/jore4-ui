// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('exampleTestid')
     */
    getByTestId(value: string): Chainable<Element>;

    /**
     * Mimics admin login by mocking auth backend response and authenticating
     * graphql calls with secret admin headers.
     * Does not support logging it with given credentials or roles so far.
     * @example cy.mockLogin()
     */
    mockLogin(): Chainable<Element>;
  }
}
