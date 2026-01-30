import { MemberStopsModal } from './MemberStopModal';

export class StopAreaMemberStops {
  static modal = MemberStopsModal;

  static getStopRow = (label: string) =>
    cy.getByTestId(`StopTableRow::row::${label}`);

  static getLink = () => cy.getByTestId('StopTableRow::link');

  static getShowOnMapButton = () => cy.getByTestId('LocatorButton::button');

  static getActionMenu = () => cy.getByTestId('StopTableRow::actionMenu');

  static getShowStopDetailsMenuItem = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');

  static getShowOnMapMenuItem = () =>
    cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');

  static getAddStopButton = () => cy.getByTestId('MemberStops::addStopButton');

  static getCancelButton = () => cy.getByTestId('MemberStops::cancelButton');

  static getSaveButton = () => cy.getByTestId('MemberStops::saveButton');

  static getSelectMemberStops = () =>
    cy.getByTestId('MemberStops::selectMemberStops');

  static getRemoveButton = () =>
    cy.getByTestId('StopTableRow::AreaEdit::remove');

  static getAddBackButton = () =>
    cy.getByTestId('StopTableRow::AreaEdit::addBack');
}
