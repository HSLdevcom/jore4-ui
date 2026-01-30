import { SelectTerminalMemberStopsDropdown } from '../../forms/SelectTerminalMemberStopsDropdown';

export class TerminalAddStopsModal {
  static dropdown = SelectTerminalMemberStopsDropdown;

  static getModal() {
    return cy.getByTestId('AddMemberStopsModal::modal');
  }

  static getSaveButton() {
    return cy.getByTestId('AddMemberStopsModal::saveButton');
  }

  static getCloseButton() {
    return cy.getByTestId('AddMemberStopsModal::closeButton');
  }
}
