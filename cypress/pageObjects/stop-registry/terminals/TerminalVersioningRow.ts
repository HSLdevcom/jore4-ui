export class TerminalVersioningRow {
  getValidityPeriod = () =>
    cy.getByTestId('TerminalVersioningRow::validityPeriod');
}
