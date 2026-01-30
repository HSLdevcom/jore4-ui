export class StopHeaderSummaryRow {
  static lineCount() {
    return cy.getByTestId('StopHeaderSummaryRow::lines::count');
  }

  static stopTypes() {
    return cy.getByTestId('StopHeaderSummaryRow::stopTypes');
  }

  static stopState() {
    return cy.getByTestId('StopHeaderSummaryRow::stopState');
  }

  static accessibleIcon() {
    return cy.getByTestId('StopHeaderSummaryRow::accessibleIcon');
  }
}
