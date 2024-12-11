export class MaintainerFormFields {
  getMaintainerDropdownButton() {
    return cy.getByTestId(
      'MaintainerFormFields::maintainerDropdown::ListboxButton',
    );
  }

  getMaintainerDropdownOptions() {
    return cy.getByTestId(
      'MaintainerFormFields::maintainerDropdown::ListboxOptions',
    );
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

  getMaintenanceMessage() {
    return cy.getByTestId('MaintainerFormFields::message');
  }
}
