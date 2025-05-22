export class TitleRow {
  privateCode() {
    return cy.getByTestId('TerminalTitleRow::privateCode');
  }

  name() {
    return cy.getByTestId('TerminalTitleRow::name');
  }
}
