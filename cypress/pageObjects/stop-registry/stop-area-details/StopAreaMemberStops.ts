import { StopTableRow } from '../StopTableRow';

export class StopAreaMemberStops {
  private stopTableRow = new StopTableRow();

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
}
