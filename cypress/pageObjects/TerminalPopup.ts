export class TerminalPopup {
  getLabel() {
    return cy.getByTestId('TerminalPopup::label');
  }

  getValidityPeriod() {
    return cy.getByTestId('TerminalPopup::validityPeriod');
  }

  getCloseButton() {
    return cy.getByTestId('TerminalPopup::closeButton');
  }

  getDeleteButton() {
    return cy.getByTestId('TerminalPopup::deleteButton');
  }

  getEditButton() {
    return cy.getByTestId('TerminalPopup::editButton');
  }

  getMoveButton() {
    return cy.getByTestId('TerminalPopup::moveButton');
  }
}
