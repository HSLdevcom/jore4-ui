export class TerminalPopup {
  static getLabel() {
    return cy.getByTestId('TerminalPopup::label');
  }

  static getValidityPeriod() {
    return cy.getByTestId('TerminalPopup::validityPeriod');
  }

  static getCloseButton() {
    return cy.getByTestId('TerminalPopup::closeButton');
  }

  static getDeleteButton() {
    return cy.getByTestId('TerminalPopup::deleteButton');
  }

  static getEditButton() {
    return cy.getByTestId('TerminalPopup::editButton');
  }

  static getMoveButton() {
    return cy.getByTestId('TerminalPopup::moveButton');
  }
}
