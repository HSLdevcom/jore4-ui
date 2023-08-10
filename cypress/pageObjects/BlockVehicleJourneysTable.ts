export class BlockVehicleJourneysTable {
  getToggleShowTableButton(title: string) {
    return cy.getByTestId(
      `BlockVehicleJourneysTable::toggleShowTable::${title}`,
    );
  }

  getTable(title: string) {
    return cy.getByTestId(`BlockVehicleJourneysTable::table::${title}`);
  }
}
