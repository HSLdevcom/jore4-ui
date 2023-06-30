export interface ParentPageObject {
  get: () => Cypress.Chainable<JQuery<HTMLElement>>;
}
