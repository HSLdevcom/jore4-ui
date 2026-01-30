import { ExternalLinksFormFields } from './ExternalLinksFormFields';

export class ExternalLinksForm {
  static externalLinks = ExternalLinksFormFields;

  static getExternalLinks() {
    return cy.getByTestId('ExternalLinksForm::externalLink');
  }

  static getNthExternalLink(index: number) {
    return ExternalLinksForm.getExternalLinks().eq(index);
  }

  static getAddNewButton() {
    return cy.getByTestId('ExternalLinksForm::addExternalLink');
  }

  static getCancelButton() {
    return cy.getByTestId('ExternalLinks::cancelButton');
  }

  static getSaveButton() {
    return cy.getByTestId('ExternalLinks::saveButton');
  }
}
