import { VehicleJourneyRow } from './timetables/import/VehicleJourneyRow';

export class BlockVehicleJourneysTable {
  vehicleJourneyRow = new VehicleJourneyRow();

  getTitleRow() {
    return cy.getByTestId('BlockVehicleJourneysTable::titleRow');
  }

  getTableRows() {
    return cy.getByTestId('VehicleJourneyRow');
  }

  getNthTableRow(nth: number) {
    return this.getTableRows().eq(nth);
  }

  getToggleShowTableButton() {
    return cy.getByTestId('BlockVehicleJourneysTable::toggleShowTable');
  }

  getTable() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  clickAllTableToggles() {
    this.getToggleShowTableButton().each((button) => {
      cy.wrap(button).click();
    });
  }
}
