export class VehicleServiceRow {
  getHour = () => {
    return cy.getByTestId('VehicleServiceRow::hour');
  };

  getMinute = () => {
    return cy.getByTestId('VehicleServiceRow::minute');
  };
}
