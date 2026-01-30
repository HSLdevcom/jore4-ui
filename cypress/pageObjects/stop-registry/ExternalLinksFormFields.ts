export class ExternalLinksFormFields {
  static getNameInput = () => cy.getByTestId('ExternalLinksFormFields::name');

  static getLocationInput = () =>
    cy.getByTestId('ExternalLinksFormFields::location');

  static getDeleteExternalLinkButton() {
    return cy.getByTestId('ExternalLinksFormFields::deleteExternalLink');
  }
}
