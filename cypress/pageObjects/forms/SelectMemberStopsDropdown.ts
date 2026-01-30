export class SelectMemberStopsDropdown {
  static getSelectedMembers() {
    return cy.getByTestId('SelectedMemberStops::option');
  }

  static getMemberOptions() {
    return cy.getByTestId('MemberStopOptions::option');
  }
}
