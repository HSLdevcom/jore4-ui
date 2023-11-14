export class BlockVehicleJourneysTable {
  getToggleShowTableButton() {
    return cy.getByTestId('BlockVehicleJourneysTable::toggleShowTable');
  }

  getTable() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  getVehicleJourneyRow(routeLabel: string, routeDirection: string) {
    return cy.getByTestId(
      `BlockVehicleJourneysTable::vehicleJourneyRow::${routeLabel}::${routeDirection}`,
    );
  }

  clickAllTableToggles() {
    this.getToggleShowTableButton().each((button) => {
      cy.wrap(button).click();
    });
  }
}
