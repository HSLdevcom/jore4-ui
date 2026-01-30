export class MemberStopsModal {
  static modal() {
    return cy.getByTestId('MemberStops::modal');
  }

  static getTransferDateInput() {
    return cy.getByTestId('MemberStops::transferDateInput');
  }

  static setTransferDate(isoDate: string) {
    MemberStopsModal.getTransferDateInput().type(isoDate);
  }

  static getStopVersionsButton() {
    return cy.getByTestId('MemberStops::getStopVersionsButton');
  }

  static getStopVersionsList() {
    return cy.getByTestId('MemberStops::stopVersionsList');
  }

  static saveButton() {
    return cy.getByTestId('MemberStops::saveButton');
  }
}
