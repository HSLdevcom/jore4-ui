export class StopAreaTitleRow {
  static getPrivateCode = () => cy.getByTestId('StopAreaTitleRow::privateCode');

  static getName = () => cy.getByTestId('StopAreaTitleRow::name');

  static getActionMenu = () => cy.getByTestId('StopAreaTitleRow::actionMenu');

  static getDeleteButton = () => cy.getByTestId('StopAreaTitleRow::delete');

  static getCopyButton = () => cy.getByTestId('StopAreaTitleRow::copy');
}
