export class SelectMemberStopsDropdown {
  dropdownButton() {
    return cy.getByTestId('SelectMemberStopsDropdownButton');
  }

  getInput() {
    return cy.getByTestId('SelectMemberStopsDropdown::input');
  }

  getWarningText() {
    return cy.getByTestId('SelectMemberStopsDropdown::warningText');
  }

  getSelectedMembers() {
    return cy.getByTestId('SelectedMemberStops::option');
  }

  getMemberOptions() {
    return cy.getByTestId('MemberStopOptions::option');
  }
}
