export class VehicleJourneyGroupInfo {
  static get() {
    return cy.getByTestId('VehicleJourneyGroupInfo');
  }

  static getChangeValidityButton() {
    return cy.getByTestId('VehicleJourneyGroupInfo::changeValidityButton');
  }

  static getValidityTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::validityTimeRange');
  }

  static getTripCount() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripCount');
  }

  static getTripTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripTimeRange');
  }
}
