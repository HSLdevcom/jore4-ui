export class StopAreaTitleRow {
  getPrivateCode = () => cy.getByTestId('StopAreaTitleRow::privateCode');

  getName = () => cy.getByTestId('StopAreaTitleRow::name');

  getActionMenu = () => cy.getByTestId('StopAreaTitleRow::actionMenu');

  getDeleteButton = () => cy.getByTestId('StopAreaTitleRow::delete');

  getCopyButton = () => cy.getByTestId('StopAreaTitleRow::copy');
}
