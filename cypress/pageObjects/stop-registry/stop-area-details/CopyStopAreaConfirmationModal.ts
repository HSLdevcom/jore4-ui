import { ConfirmModal } from '../../ConfirmModal';

export class CopyStopAreaConfirmationModal {
  buttons = new ConfirmModal();

  modal() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::modal');
  }

  getCurrentVersion() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::currentVersion');
  }

  getNewVersion() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::newVersion');
  }

  getCutDate() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::cutDate');
  }
}
