import { ConfirmModal } from '../../shared-components/ConfirmModal';

export class CopyStopAreaConfirmationModal {
  static buttons = ConfirmModal;

  static modal() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::modal');
  }

  static getCurrentVersion() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::currentVersion');
  }

  static getNewVersion() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::newVersion');
  }

  static getCutDate() {
    return cy.getByTestId('CopyStopAreaCutConfirmationModal::cutDate');
  }
}
