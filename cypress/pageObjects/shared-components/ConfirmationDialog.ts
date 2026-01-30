import { DialogWithButtons } from './DialogWithButtons';

export class ConfirmationDialog {
  static dialogWithButtons = DialogWithButtons;

  static getConfirmButton() {
    return cy.getByTestId('ConfirmationDialog::confirmButton');
  }

  static getCancelButton() {
    return cy.getByTestId('ConfirmationDialog::cancelButton');
  }
}
