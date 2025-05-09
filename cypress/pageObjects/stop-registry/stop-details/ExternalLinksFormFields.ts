export class ExternalLinksFormFields {
  getNameInput = () => cy.getByTestId('ExternalLinksFormFields::name');

  getLocationInput = () => cy.getByTestId('ExternalLinksFormFields::location');

  getDeleteExternalLinkButton() {
    return cy.getByTestId('ExternalLinksFormFields::deleteExternalLink');
  }
}
