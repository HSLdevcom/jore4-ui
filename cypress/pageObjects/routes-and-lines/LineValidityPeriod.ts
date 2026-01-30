export class LineValidityPeriod {
  static getLineValidityPeriod() {
    return cy.getByTestId('LineValidityPeriod::validityPeriod');
  }

  static getLinePriority() {
    return cy.getByTestId('LineValidityPeriod::priority');
  }
}
