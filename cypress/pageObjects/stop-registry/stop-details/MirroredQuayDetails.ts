import { ConfirmationDialog } from '../../shared-components';

export class MirroredQuayDetails {
  static cards() {
    return cy.getByTestId('MirroredQuayDetails::container');
  }

  static removeButton() {
    return cy.getByTestId('MirroredQuayDetails::remove');
  }

  static confirmationDialog = ConfirmationDialog;
}
