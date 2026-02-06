export class StopPopUp {
  static getIsSelected() {
    return cy.getByTestId('StopPopUp::isSelected');
  }

  static getMoveButton() {
    return cy.getByTestId('StopPopUp::moveButton');
  }

  static getEditButton() {
    return cy.getByTestId('StopPopUp::editButton');
  }

  static getDeleteButton() {
    return cy.getByTestId('StopPopUp::deleteButton');
  }

  static getCopyButton() {
    return cy.getByTestId('StopPopUp::copyButton');
  }

  static getCloseButton() {
    return cy.getByTestId('StopPopUp::closeButton');
  }

  static getLabel() {
    return cy.getByTestId('StopPopUp::label');
  }
}
