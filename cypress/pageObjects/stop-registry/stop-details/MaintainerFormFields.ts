export class MaintainerFormFields {
  static getMaintainerDropdown() {
    return cy.getByTestId('MaintainerFormFields::maintainerDropdown');
  }

  static getMaintainerDropdownButton() {
    return cy.getByTestId('MaintainerFormFields::maintainerDropdown::button');
  }

  static getEditOrganisationButton() {
    return cy.getByTestId('MaintainerFormFields::editOrganisationButton');
  }

  static getPhone() {
    return cy.getByTestId('MaintainerFormFields::phone');
  }

  static getEmail() {
    return cy.getByTestId('MaintainerFormFields::email');
  }
}
