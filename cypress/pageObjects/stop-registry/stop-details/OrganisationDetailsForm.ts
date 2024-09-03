export class OrganisationDetailsForm {
  getCancelButton() {
    return cy.getByTestId('OrganisationDetailsForm::cancelButton');
  }

  getSaveButton() {
    return cy.getByTestId('OrganisationDetailsForm::saveButton');
  }

  getName() {
    return cy.getByTestId('OrganisationDetailsForm::name');
  }

  getPhone() {
    return cy.getByTestId('OrganisationDetailsForm::phone');
  }

  getEmail() {
    return cy.getByTestId('OrganisationDetailsForm::email');
  }
}
