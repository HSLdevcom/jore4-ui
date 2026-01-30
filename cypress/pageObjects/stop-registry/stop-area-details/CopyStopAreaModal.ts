import { CopyStopAreaConfirmationModal } from './CopyStopAreaConfirmationModal';
import { CopyStopAreaForm } from './CopyStopAreaForm';

export class CopyStopAreaModal {
  static form = CopyStopAreaForm;

  static confirmationModal = CopyStopAreaConfirmationModal;

  static modal() {
    return cy.getByTestId('CopyStopAreaModal::modal');
  }

  static getBoilerplateNames() {
    return cy.getByTestId('CopyStopAreaModal::names');
  }

  static getBoilerplateValidity() {
    return cy.getByTestId('CopyStopAreaModal::validity');
  }
}
