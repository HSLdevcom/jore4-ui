import { VehicleJourneyRow } from './import/VehicleJourneyRow';

export class BlockVehicleJourneysTable {
  static vehicleJourneyRow = VehicleJourneyRow;

  static getTitleRow() {
    return cy.getByTestId('BlockVehicleJourneysTable::titleRow');
  }

  static getTableRows() {
    return cy.getByTestId('VehicleJourneyRow');
  }

  static getNthTableRow(nth: number) {
    return BlockVehicleJourneysTable.getTableRows().eq(nth);
  }

  static getToggleShowTableButton() {
    return cy.getByTestId('BlockVehicleJourneysTable::toggleShowTable');
  }

  static getTable() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  static clickAllTableToggles() {
    BlockVehicleJourneysTable.getToggleShowTableButton().each((button) => {
      cy.wrap(button).click();
    });
  }
}
