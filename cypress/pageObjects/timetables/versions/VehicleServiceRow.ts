export class VehicleServiceRow {
  static getHour = () => {
    return cy.getByTestId('VehicleServiceRow::hour');
  };

  static getMinute = () => {
    return cy.getByTestId('VehicleServiceRow::minute');
  };
}
