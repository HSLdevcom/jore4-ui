import { ExternalLinksForm } from './ExternalLinksForm';

export class ExternalLinksSection {
  static form = ExternalLinksForm;

  static getTitle() {
    return cy.getByTestId('ExternalLinks::title');
  }

  static getExternalLinks() {
    return cy.getByTestId('ExternalLinks::externalLink');
  }

  static getNthExternalLink(index: number) {
    return ExternalLinksSection.getExternalLinks().eq(index);
  }

  static getName = () => cy.getByTestId('ExternalLinks::name');

  static getLocation = () => cy.getByTestId('ExternalLinks::openExternalLink');

  static getNoExternalLinks() {
    return cy.getByTestId('ExternalLinks::noExternalLinks');
  }

  static getEditButton() {
    return cy.getByTestId('ExternalLinks::editButton');
  }
}
