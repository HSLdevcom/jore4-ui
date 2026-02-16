export class StopVersionRow {
  static rows() {
    return cy.get("[data-test-element-type='StopVersionRow'");
  }

  rows = () => StopVersionRow.rows();

  static changed() {
    return cy.getByTestId('StopVersionRow::changed');
  }

  changed = () => StopVersionRow.changed();

  static changedBy() {
    return cy.getByTestId('StopVersionRow::changedBy');
  }

  changedBy = () => StopVersionRow.changedBy();

  static status() {
    return cy.getByTestId('StopVersionRow::status');
  }

  status = () => StopVersionRow.status();

  static validityEnd() {
    return cy.getByTestId('StopVersionRow::validityEnd');
  }

  validityEnd = () => StopVersionRow.validityEnd();

  static validityStart() {
    return cy.getByTestId('StopVersionRow::validityStart');
  }

  validityStart = () => StopVersionRow.validityStart();

  static versionComment() {
    return cy.getByTestId('StopVersionRow::versionComment');
  }

  versionComment = () => StopVersionRow.versionComment();

  static locatorButton() {
    return cy.getByTestId('LocatorButton::button');
  }

  locatorButton = () => StopVersionRow.locatorButton();

  static actionMenu() {
    return cy.getByTestId('StopVersionRow::actionMenu');
  }

  actionMenu = () => StopVersionRow.actionMenu();

  static actionMenuShowOnMap() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');
  }

  actionMenuShowOnMap = () => StopVersionRow.actionMenuShowOnMap();

  static actionMenuShowStopDetails() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');
  }

  actionMenuShowStopDetails = () => StopVersionRow.actionMenuShowStopDetails();
}
