import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';

export class SelectStopDropdown {
  common = new SelectMemberStopsDropdown();

  dropdownButton() {
    return cy.getByTestId('SelectStopDropdownButton');
  }

  getInput() {
    return cy.getByTestId('SelectStopDropdown::input');
  }

  getWarningText() {
    return cy.getByTestId('SelectStopDropdown::warningText');
  }
}
