import { ExternalLinksFormFields } from './ExternalLinksFormFields';

export class ExternalLinksForm {
  externalLinks = new ExternalLinksFormFields();

  getExternalLinks() {
    return cy.getByTestId('ExternalLinksForm::externalLink');
  }

  getNthExternalLink(index: number) {
    return this.getExternalLinks().eq(index);
  }

  getAddNewButton() {
    return cy.getByTestId('ExternalLinksForm::addExternalLink');
  }

  getCancelButton() {
    return cy.getByTestId('ExternalLinks::cancelButton');
  }

  getSaveButton() {
    return cy.getByTestId('ExternalLinks::saveButton');
  }
}
