export type ExternalLinkData = {
  readonly name: string;
  readonly location: string;
};

export function assertExternalLinksChanged(
  getOldValue: () => Cypress.Chainable<JQuery<HTMLElement>>,
  getNewValue: () => Cypress.Chainable<JQuery<HTMLElement>>,
  oldLinks: readonly ExternalLinkData[],
  newLinks: readonly ExternalLinkData[],
) {
  oldLinks.forEach((link) => {
    getOldValue()
      .should('contain.text', link.name)
      .and('contain.text', `(${link.location})`);
  });

  newLinks.forEach((link) => {
    getNewValue()
      .should('contain.text', link.name)
      .and('contain.text', `(${link.location})`);
  });
}
