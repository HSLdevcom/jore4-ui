export class VehicleServiceTable {
  getTable(dayType: string) {
    return cy.getByTestId(`VehicleServiceTable::${dayType}`);
  }

  getHeadingButton() {
    return cy.getByTestId('VehicleServiceTable::headingButton');
  }
}
