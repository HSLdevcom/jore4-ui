export class StopAreaPopup {
  getLabel() {
    return cy.getByTestId('StopAreaPopup::label');
  }

  getValidityPeriod() {
    return cy.getByTestId('StopAreaPopup::validityPeriod');
  }

  getCloseButton() {
    return cy.getByTestId('StopAreaPopup::closeButton');
  }

  getDeleteButton() {
    return cy.getByTestId('StopAreaPopup::deleteButton');
  }

  getEditButton() {
    return cy.getByTestId('StopAreaPopup::editButton');
  }

  getMoveButton() {
    return cy.getByTestId('StopAreaPopup::moveButton');
  }

  getAddStopButton() {
    return cy.getByTestId('StopAreaPopup::addStopButton');
  }
}
