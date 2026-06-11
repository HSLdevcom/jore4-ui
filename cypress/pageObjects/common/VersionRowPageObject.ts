import Chainable = Cypress.Chainable;

/**
 * Base class for version row page objects with common functionality
 */
export abstract class VersionRowBase {
  protected abstract rowTestIdPrefix: string;

  rows(): Chainable<JQuery> {
    return cy.get(`[data-test-element-type='${this.rowTestIdPrefix}']`);
  }

  changed(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::changed`);
  }

  changedBy(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::changedBy`);
  }

  status(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::status`);
  }

  validityEnd(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::validityEnd`);
  }

  validityStart(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::validityStart`);
  }

  versionComment(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::versionComment`);
  }

  locatorButton(): Chainable<JQuery> {
    return cy.getByTestId('LocatorButton::button');
  }

  actionMenu(): Chainable<JQuery> {
    return cy.getByTestId(`${this.rowTestIdPrefix}::actionMenu`);
  }
}
