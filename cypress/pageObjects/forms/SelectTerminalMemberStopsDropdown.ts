import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';

export class SelectTerminalMemberStopsDropdown {
  static common = SelectMemberStopsDropdown;

  static dropdownButton() {
    return cy.getByTestId('SelectMemberStopsDropdownButton');
  }

  static getInput() {
    return cy.getByTestId('BaseSelectMemberStopsDropdown::input');
  }

  static getWarningText() {
    return cy.getByTestId('SelectTerminalMemberStopsDropdown::warningText');
  }
}
