export class StopHeaderSummaryRow {
  lineCount() {
    return cy.getByTestId('StopHeaderSummaryRow::lines::count');
  }

  stopTypes() {
    return cy.getByTestId('StopHeaderSummaryRow::stopTypes');
  }

  stopState() {
    return cy.getByTestId('StopHeaderSummaryRow::stopState');
  }

  accessibleIcon() {
    return cy.getByTestId('StopHeaderSummaryRow::accessibleIcon');
  }
}
