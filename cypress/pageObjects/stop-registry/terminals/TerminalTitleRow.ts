export class TerminalTitleRow {
  static getPrivateCode() {
    return cy.getByTestId('TerminalTitleRow::privateCode');
  }

  static getName() {
    return cy.getByTestId('TerminalTitleRow::name');
  }

  static getLocatorButton() {
    return cy.getByTestId('TerminalTitleRow::locatorButton');
  }
}
