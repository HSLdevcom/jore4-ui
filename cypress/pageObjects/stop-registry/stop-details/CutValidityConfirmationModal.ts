import { ConfirmModal } from '../../ConfirmModal';

export class OverlappingVersionCutConfirmationModal {
  confirmationModal = new ConfirmModal();

  modal() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::modal');
  }

  currentVersion() {
    return cy.getByTestId(
      'OverlappingVersionCutConfirmationModal::currentVersion',
    );
  }

  newVersion() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::newVersion');
  }

  cutDate() {
    return cy.getByTestId('OverlappingVersionCutConfirmationModal::cutDate');
  }
}
