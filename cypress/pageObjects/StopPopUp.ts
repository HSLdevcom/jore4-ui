export class StopPopUp {
  getMoveButton() {
    return cy.getByTestId('StopPopUp::moveButton');
  }

  getEditButton() {
    return cy.getByTestId('StopPopUp::editButton');
  }

  getDeleteButton() {
    return cy.getByTestId('StopPopUp::deleteButton');
  }

  getCloseButton() {
    return cy.getByTestId('StopPopUp::closeButton');
  }

  getLabel() {
    return cy.getByTestId('StopPopUp::label');
  }
}
