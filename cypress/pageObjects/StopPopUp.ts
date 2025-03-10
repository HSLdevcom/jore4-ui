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

  getLabel() {
    return cy.getByTestId('StopPopUp::label');
  }
}
