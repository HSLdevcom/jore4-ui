export class StopAreaPopup {
  static getLabel() {
    return cy.getByTestId('StopAreaPopup::label');
  }

  static getValidityPeriod() {
    return cy.getByTestId('StopAreaPopup::validityPeriod');
  }

  static getCloseButton() {
    return cy.getByTestId('StopAreaPopup::closeButton');
  }

  static getDeleteButton() {
    return cy.getByTestId('StopAreaPopup::deleteButton');
  }

  static getEditButton() {
    return cy.getByTestId('StopAreaPopup::editButton');
  }

  static getMoveButton() {
    return cy.getByTestId('StopAreaPopup::moveButton');
  }

  static getAddStopButton() {
    return cy.getByTestId('StopAreaPopup::addStopButton');
  }
}
