export class OrganisationDetailsForm {
  static getCancelButton() {
    return cy.getByTestId('OrganisationDetailsForm::cancelButton');
  }

  static getSaveButton() {
    return cy.getByTestId('OrganisationDetailsForm::saveButton');
  }

  static getName() {
    return cy.getByTestId('OrganisationDetailsForm::name');
  }

  static getPhone() {
    return cy.getByTestId('OrganisationDetailsForm::phone');
  }

  static getEmail() {
    return cy.getByTestId('OrganisationDetailsForm::email');
  }
}
