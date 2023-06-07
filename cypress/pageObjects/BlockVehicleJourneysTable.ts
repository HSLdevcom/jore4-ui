export class BlockVehicleJourneysTable {
  getToggleShowTableButton() {
    return cy.getByTestId('BlockVehicleJourneysTable::toggleShowTable');
  }

  getTable() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }
}
