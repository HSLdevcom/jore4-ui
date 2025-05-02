import { ExternalLinksForm } from './ExternalLinksForm';

export class ExternalLinksSection {
  form = new ExternalLinksForm();

  getTitle() {
    return cy.getByTestId('ExternalLinks::title');
  }

  getExternalLinks() {
    return cy.getByTestId('ExternalLinks::externalLink');
  }

  getNthExternalLink(index: number) {
    return this.getExternalLinks().eq(index);
  }

  getName = () => cy.getByTestId('ExternalLinks::name');

  getNoExternalLinks() {
    return cy.getByTestId('ExternalLinks::noExternalLinks');
  }

  getEditButton() {
    return cy.getByTestId('ExternalLinks::editButton');
  }
}
