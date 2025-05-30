export class TitleRow {
  getPrivateCode() {
    return cy.getByTestId('TerminalTitleRow::privateCode');
  }

  getName() {
    return cy.getByTestId('TerminalTitleRow::name');
  }
}
