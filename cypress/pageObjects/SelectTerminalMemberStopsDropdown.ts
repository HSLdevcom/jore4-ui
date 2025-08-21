import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';

export class SelectTerminalMemberStopsDropdown {
  common = new SelectMemberStopsDropdown();

  dropdownButton() {
    return cy.getByTestId('SelectMemberStopsDropdownButton');
  }

  getInput() {
    return cy.getByTestId('BaseSelectMemberStopsDropdown::input');
  }

  getWarningText() {
    return cy.getByTestId('SelectTerminalMemberStopsDropdown::warningText');
  }
}
