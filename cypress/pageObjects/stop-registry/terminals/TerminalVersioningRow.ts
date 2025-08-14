export class TerminalVersioningRow {
  getValidityPeriod = () =>
    cy.getByTestId('TerminalVersioningRow::validityPeriod');

  getEditValidityButton = () =>
    cy.getByTestId('TerminalVersioningRow::editTerminalValidityButton');
}
