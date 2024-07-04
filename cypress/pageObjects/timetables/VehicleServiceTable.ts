export class VehicleServiceTable {
  getChangeValidityButton() {
    return cy.getByTestId('VehicleJourneyGroupInfo::changeValidityButton');
  }

  getHeadingButton() {
    return cy.getByTestId('VehicleServiceTable::headingButton');
  }
}
