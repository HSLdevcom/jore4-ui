export class TimetableVersionTableRow {
  getDayType() {
    return cy.getByTestId('TimetableVersionTableRow::dayType');
  }

  getValidityStart() {
    return cy.getByTestId('TimetableVersionTableRow::validityStart');
  }

  getValidityEnd() {
    return cy.getByTestId('TimetableVersionTableRow::validityEnd');
  }

  getActionsButton() {
    return cy.getByTestId('TimetableVersionTableRow::actions');
  }

  getVersionPanelMenuItemButton() {
    return cy.getByTestId('TimetableVersionTableRow::versionPanelMenuItem');
  }
}
