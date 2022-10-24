export class ConfirmationDialog {
  getConfirmButton() {
    return cy.getByTestId('ConfirmationDialog::confirmButton');
  }
}
