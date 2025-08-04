import { DialogWithButtons } from './DialogWithButtons';

export class ConfirmationDialog {
  dialogWithButtons = new DialogWithButtons();

  getConfirmButton() {
    return cy.getByTestId('ConfirmationDialog::confirmButton');
  }

  getCancelButton() {
    return cy.getByTestId('ConfirmationDialog::cancelButton');
  }
}
