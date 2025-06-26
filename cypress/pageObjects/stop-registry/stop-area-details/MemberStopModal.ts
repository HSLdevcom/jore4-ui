export class MemberStopsModal {
  modal() {
    return cy.getByTestId('MemberStops::modal');
  }

  getTransferDateInput() {
    return cy.getByTestId('MemberStops::transferDateInput');
  }

  setTransferDate(isoDate: string) {
    this.getTransferDateInput().type(isoDate);
  }

  getStopVersionsButton() {
    return cy.getByTestId('MemberStops::getStopVersionsButton');
  }

  getStopVersionsList() {
    return cy.getByTestId('MemberStops::stopVersionsList');
  }

  saveButton() {
    return cy.getByTestId('MemberStops::saveButton');
  }
}
