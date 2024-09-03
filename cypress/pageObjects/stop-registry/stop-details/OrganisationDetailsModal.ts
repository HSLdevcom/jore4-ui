import { OrganisationDetailsForm } from './OrganisationDetailsForm';

export class OrganisationDetailsModal {
  form = new OrganisationDetailsForm();

  getModal() {
    return cy.getByTestId('OrganisationDetailsModal');
  }

  getTitle() {
    return cy.getByTestId('OrganisationDetailsModal::title');
  }
}
