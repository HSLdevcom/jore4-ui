export class TerminalVersioningRow {
  static getValidityPeriod = () =>
    cy.getByTestId('TerminalVersioningRow::validityPeriod');

  static getEditValidityButton = () =>
    cy.getByTestId('TerminalVersioningRow::editTerminalValidityButton');

  static getChangeHistoryLink = () =>
    cy.getByTestId('TerminalVersioningRow::changeHistoryLink');
}
