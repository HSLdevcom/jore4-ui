import { VehicleJourneyRow } from './timetables/import/VehicleJourneyRow';

export class BlockVehicleJourneysTable {
  vehicleJourneyRow = new VehicleJourneyRow();

  getTitleRow() {
    return cy.getByTestId('BlockVehicleJourneysTable::titleRow');
  }

  getTableRows() {
    // TODO: This is just temp solution and will be changed to normal data-testid
    // after all vehiclejourneyRow::label::direction usages have been removed.
    // label and direction is not enough to identify one row anyway, because there
    // always is more than one journey per direction
    return cy.get('[data-testidtemp="VehicleJourneyRow"]');
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

  getVehicleJourneyRow(routeLabel: string, routeDirection: string) {
    return cy.getByTestId(
      `VehicleJourneyRow::${routeLabel}::${routeDirection}`,
    );
  }

  clickAllTableToggles() {
    this.getToggleShowTableButton().each((button) => {
      cy.wrap(button).click();
    });
  }
}
