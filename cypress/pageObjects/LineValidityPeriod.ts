export class LineValidityPeriod {
  getLineValidityPeriod() {
    return cy.getByTestId('LineValidityPeriod::validityPeriod');
  }

  getLinePriority() {
    return cy.getByTestId('LineValidityPeriod::priority');
  }
}
