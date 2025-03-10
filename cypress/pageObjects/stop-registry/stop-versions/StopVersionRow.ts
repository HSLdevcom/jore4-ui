export class StopVersionRow {
  rows = () => cy.get("[data-test-element-type='StopVersionRow'");

  changed = () => cy.getByTestId('StopVersionRow::changed');

  changedBy = () => cy.getByTestId('StopVersionRow::changedBy');

  status = () => cy.getByTestId('StopVersionRow::status');

  validityEnd = () => cy.getByTestId('StopVersionRow::validityEnd');

  validityStart = () => cy.getByTestId('StopVersionRow::validityStart');

  versionComment = () => cy.getByTestId('StopVersionRow::versionComment');

  locatorButton = () => cy.getByTestId('LocatorButton::button');

  actionMenu = () => cy.getByTestId('StopVersionRow::actionMenu');

  actionMenuShowOnMap = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');

  actionMenuShowStopDetails = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');
}
