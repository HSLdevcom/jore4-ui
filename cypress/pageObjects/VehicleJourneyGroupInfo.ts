export class VehicleJourneyGroupInfo {
  getChangeValidityButton() {
    return cy.getByTestId('VehicleJourneyGroupInfo::changeValidityButton');
  }

  getValidityTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::validityRangeSpan');
  }
}
