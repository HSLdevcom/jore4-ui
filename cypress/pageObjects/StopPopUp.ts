export class StopPopUp {
  getIsSelected() {
    return cy.getByTestId('StopPopUp::isSelected');
  }

  getMoveButton() {
    return cy.getByTestId('StopPopUp::moveButton');
  }

  getEditButton() {
    return cy.getByTestId('StopPopUp::editButton');
  }

  getDeleteButton() {
    return cy.getByTestId('StopPopUp::deleteButton');
  }

  getCopyButton() {
    return cy.getByTestId('StopPopUp::copyButton');
  }

  getCloseButton() {
    return cy.getByTestId('StopPopUp::closeButton');
  }

  getLabel() {
    return cy.getByTestId('StopPopUp::label');
  }
}
