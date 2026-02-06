import { OrganisationDetailsForm } from './OrganisationDetailsForm';

export class OrganisationDetailsModal {
  static form = OrganisationDetailsForm;

  static getModal() {
    return cy.getByTestId('OrganisationDetailsModal');
  }

  static getTitle() {
    return cy.getByTestId('OrganisationDetailsModal::title');
  }
}
