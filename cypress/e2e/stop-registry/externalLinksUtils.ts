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
  const oldValueElement = getOldValue();
  oldLinks.forEach((link) => {
    oldValueElement
      .should('contain.text', link.name)
      .and('contain.text', `(${link.location})`);
  });

  const newValueElement = getNewValue();
  newLinks.forEach((link) => {
    newValueElement
      .should('contain.text', link.name)
      .and('contain.text', `(${link.location})`);
  });
}
