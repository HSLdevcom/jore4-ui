export class MaintainerFormFields {
  getMaintainerDropdown() {
    return cy.getByTestId('MaintainerFormFields::maintainerDropdown');
  }

  getMaintainerDropdownButton() {
    return cy.getByTestId('MaintainerFormFields::maintainerDropdown::button');
  }

  getEditOrganisationButton() {
    return cy.getByTestId('MaintainerFormFields::editOrganisationButton');
  }

  getPhone() {
    return cy.getByTestId('MaintainerFormFields::phone');
  }

  getEmail() {
    return cy.getByTestId('MaintainerFormFields::email');
  }
}
