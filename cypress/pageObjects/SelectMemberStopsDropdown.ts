export class SelectMemberStopsDropdown {
  getSelectedMembers() {
    return cy.getByTestId('SelectedMemberStops::option');
  }

  getMemberOptions() {
    return cy.getByTestId('MemberStopOptions::option');
  }
}
