import { SelectTerminalMemberStopsDropdown } from '../../SelectTerminalMemberStopsDropdown';

export class TerminalAddStopsModal {
  dropdown = new SelectTerminalMemberStopsDropdown();

  getModal() {
    return cy.getByTestId('AddMemberStopsModal::modal');
  }

  getSaveButton() {
    return cy.getByTestId('AddMemberStopsModal::saveButton');
  }

  getCloseButton() {
    return cy.getByTestId('AddMemberStopsModal::closeButton');
  }
}
