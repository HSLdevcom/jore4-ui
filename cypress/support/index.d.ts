// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('exampleTestid')
     */
    getByTestId(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.findByTestId('exampleTestid')
     * Difference of "get" vs "find" is explained in cypress docs:
     * https://docs.cypress.io/api/commands/get#Get-vs-Find
     */
    findByTestId(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to click input field, clear it and type value
     */
    clearAndType(value: string): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to check if element has text
     */
    shouldHaveText(value: string): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to check if element is visible
     */
    shouldBeVisible(): Chainable<JQuery<HtmlElement>>;

    /**
     * Custom command to check if element is disabled
     */
    shouldBeDisabled(): Chainable<JQuery<HtmlElement>>;

    /**
     * Mimics admin login by mocking auth backend response and authenticating
     * graphql calls with secret admin headers.
     * Does not support logging it with given credentials or roles so far.
     * @example cy.mockLogin()
     */
    mockLogin(): Chainable<void>;

    /**
     * Sets up default configurations for every test.
     * @example cy.setupTests()
     */
    setupTests(): Chainable<void>;
  }
}
