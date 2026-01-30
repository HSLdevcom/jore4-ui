export class VehicleJourneyRow {
  static getDirectionBadge() {
    return cy.getByTestId('DirectionBadge');
  }

  static getLabel() {
    return cy.getByTestId('VehicleJourneyRow::label');
  }

  static getDayType() {
    return cy.getByTestId('VehicleJourneyRow::dayTypeName');
  }

  static getStartTime() {
    return cy.getByTestId('VehicleJourneyRow::startTime');
  }

  static getEndTime() {
    return cy.getByTestId('VehicleJourneyRow::endTime');
  }

  static getContractNumber() {
    return cy.getByTestId('VehicleJourneyRow::contractNumber');
  }
}
