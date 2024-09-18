export class StopAreaMemberStops {
  getStopRow = (label: string) => cy.getByTestId(`StopTableRow::row::${label}`);

  getLink = () => cy.getByTestId('StopTableRow::link');

  getShowOnMapButton = () => cy.getByTestId('LocatorButton::button');

  getActionMenu = () => cy.getByTestId('StopTableRow::actionMenu');

  getShowStopDetailsMenuItem = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');

  getShowOnMapMenuItem = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');

  getRemoveStopMenuItem = () =>
    cy.getByTestId('StopTableRow::ActionMenu::removeStopMenuItem');

  getAddStopButton = () => cy.getByTestId('MemberStops::addStopButton');

  getCancelButton = () => cy.getByTestId('MemberStops::cancelButton');

  getSaveButton = () => cy.getByTestId('MemberStops::saveButton');

  getSelectMemberStops = () => cy.getByTestId('MemberStops::selectMemberStops');

  getRemoveButton = () => cy.getByTestId('StopTableRow::AreaEdit::remove');

  getAddBackButton = () => cy.getByTestId('StopTableRow::AreaEdit::addBack');
}
