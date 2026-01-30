export class ConfirmModal {
  static getConfirmButton() {
    return cy.getByTestId('ConfirmModal::confirmButton');
  }

  static getCancelButton() {
    return cy.getByTestId('ConfirmModal::cancelButton');
  }
}
