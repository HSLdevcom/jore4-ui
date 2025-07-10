export class ConfirmModal {
  getConfirmButton() {
    return cy.getByTestId('ConfirmModal::confirmButton');
  }

  getCancelButton() {
    return cy.getByTestId('ConfirmModal::cancelButton');
  }
}
