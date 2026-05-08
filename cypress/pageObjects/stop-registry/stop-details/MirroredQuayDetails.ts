import { ConfirmationDialog } from '../../shared-components';

export class MirroredQuayDetails {
  static cards() {
    return cy.get('[data-testid^="MirroredQuayDetails::"]');
  }

  static removeButton() {
    return cy
      .get('[data-testid$="::remove"]')
      .filter('[data-testid^="MirroredQuayDetails::"]');
  }

  static confirmationDialog = ConfirmationDialog;
}
