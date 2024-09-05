export class StopAreaVersioningRow {
  getValidityPeriod = () =>
    cy.getByTestId('StopAreaVersioningRow::validityPeriod');
}
