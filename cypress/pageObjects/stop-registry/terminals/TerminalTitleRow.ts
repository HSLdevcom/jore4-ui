export class TerminalTitleRow {
  getPrivateCode() {
    return cy.getByTestId('TerminalTitleRow::privateCode');
  }

  getName() {
    return cy.getByTestId('TerminalTitleRow::name');
  }

  getLocatorButton() {
    return cy.getByTestId('TerminalTitleRow::locatorButton');
  }
}
