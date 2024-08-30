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
}
