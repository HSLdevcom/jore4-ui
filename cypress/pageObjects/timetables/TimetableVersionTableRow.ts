export class TimetableVersionTableRow {
  static getDayType() {
    return cy.getByTestId('TimetableVersionTableRow::dayType');
  }

  static getValidityStart() {
    return cy.getByTestId('TimetableVersionTableRow::validityStart');
  }

  static getValidityEnd() {
    return cy.getByTestId('TimetableVersionTableRow::validityEnd');
  }

  static getActionsButton() {
    return cy.getByTestId('TimetableVersionTableRow::actions');
  }

  static getVersionPanelMenuItemButton() {
    return cy.getByTestId('TimetableVersionTableRow::versionPanelMenuItem');
  }
}
