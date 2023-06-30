export class VehicleServiceTable {
  getTable() {
    return cy.getByTestId('VehicleServiceTable::table');
  }

  getHeadingButton(dayType: string) {
    return cy
      .getByTestId('VehicleServiceTable::headingButton')
      .contains(dayType);
  }
}
