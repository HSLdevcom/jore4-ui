export class StopAreaTitleRow {
  getDescription = () => cy.getByTestId('StopAreaTitleRow::description');

  getName = () => cy.getByTestId('StopAreaTitleRow::name');
}
