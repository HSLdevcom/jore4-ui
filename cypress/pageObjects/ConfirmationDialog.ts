export class ConfirmationDialog {
  getConfirmButton() {
    return cy.getByTestId('ConfirmationDialog::confirmButton');
  }

  getCancelButton() {
    return cy.getByTestId('ConfirmationDialog::cancelButton');
  }
}
