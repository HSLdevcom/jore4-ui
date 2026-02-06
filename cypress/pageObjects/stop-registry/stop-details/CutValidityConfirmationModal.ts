import { ConfirmModal } from '../../shared-components/ConfirmModal';

export class OverlappingVersionCutConfirmationModal {
  static confirmationModal = ConfirmModal;

  static modal() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::modal');
  }

  static currentVersion() {
    return cy.getByTestId(
      'OverlappingVersionCutConfirmationModal::currentVersion',
    );
  }

  static newVersion() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::newVersion');
  }

  static cutDate() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::cutDate');
  }
}
