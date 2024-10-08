export class VehicleJourneyGroupInfo {
  get() {
    return cy.getByTestId('VehicleJourneyGroupInfo');
  }

  getChangeValidityButton() {
    return cy.getByTestId('VehicleJourneyGroupInfo::changeValidityButton');
  }

  getValidityTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::validityTimeRange');
  }

  getTripCount() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripCount');
  }

  getTripTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripTimeRange');
  }
}
