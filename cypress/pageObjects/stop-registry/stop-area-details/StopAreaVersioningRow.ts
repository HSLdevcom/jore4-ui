export class StopAreaVersioningRow {
  getValidityPeriod = () =>
    cy.getByTestId('StopAreaVersioningRow::validityPeriod');

  getChangeHistoryLink = () =>
    cy.getByTestId('StopAreaVersioningRow::changeHistoryLink');
}
