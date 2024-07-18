export class VehicleJourneyRow {
  getDirectionBadge() {
    return cy.getByTestId('DirectionBadge');
  }

  getLabel() {
    return cy.getByTestId('VehicleJourneyRow::label');
  }

  getDayType() {
    return cy.getByTestId('VehicleJourneyRow::dayTypeName');
  }

  getStartTime() {
    return cy.getByTestId('VehicleJourneyRow::startTime');
  }

  getEndTime() {
    return cy.getByTestId('VehicleJourneyRow::endTime');
  }

  getContractNumber() {
    return cy.getByTestId('VehicleJourneyRow::contractNumber');
  }
}
