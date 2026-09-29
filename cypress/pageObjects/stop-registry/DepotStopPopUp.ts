export class DepotStopPopUp {
  static getMoveButton() {
    return cy.getByTestId('DepotStopPopup::moveButton');
  }

  static getEditButton() {
    return cy.getByTestId('DepotStopPopup::editButton');
  }

  static getDeleteButton() {
    return cy.getByTestId('DepotStopPopup::deleteButton');
  }

  static getCloseButton() {
    return cy.getByTestId('DepotStopPopup::closeButton');
  }

  static getLabel() {
    return cy.getByTestId('DepotStopPopup::label');
  }
}
