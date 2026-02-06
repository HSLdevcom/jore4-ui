import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';

export class SelectStopDropdown {
  static common = SelectMemberStopsDropdown;

  static dropdownButton() {
    return cy.getByTestId('SelectStopDropdownButton');
  }

  static getInput() {
    return cy.getByTestId('SelectStopDropdown::input');
  }

  static getWarningText() {
    return cy.getByTestId('SelectStopDropdown::warningText');
  }
}
