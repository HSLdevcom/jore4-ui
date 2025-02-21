export class StopAreaTitleRow {
  getPrivateCode = () => cy.getByTestId('StopAreaTitleRow::privateCode');

  getName = () => cy.getByTestId('StopAreaTitleRow::name');
}
