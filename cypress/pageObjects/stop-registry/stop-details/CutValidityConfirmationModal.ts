import { ConfirmModal } from '../../ConfirmModal';

export class CutValidityConfirmationModal {
  confirmationModal = new ConfirmModal();

  modal() {
    return cy.getByTestId('CutValidityConfirmationModal::modal');
  }

  currentVersion() {
    return cy.getByTestId('CutValidityConfirmationModal::currentVersion');
  }

  newVersion() {
    return cy.getByTestId('CutValidityConfirmationModal::newVersion');
  }

  cutDate() {
    return cy.getByTestId('CutValidityConfirmationModal::cutDate');
  }
}
