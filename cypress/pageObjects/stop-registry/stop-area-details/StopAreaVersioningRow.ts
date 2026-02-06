export class StopAreaVersioningRow {
  static getValidityPeriod = () =>
    cy.getByTestId('StopAreaVersioningRow::validityPeriod');

  static getChangeHistoryLink = () =>
    cy.getByTestId('StopAreaVersioningRow::changeHistoryLink');
}
