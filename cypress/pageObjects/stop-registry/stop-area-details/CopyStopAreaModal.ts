import { CopyStopAreaConfirmationModal } from './CopyStopAreaConfirmationModal';
import { CopyStopAreaForm } from './CopyStopAreaForm';

export class CopyStopAreaModal {
  form = new CopyStopAreaForm();

  confirmationModal = new CopyStopAreaConfirmationModal();

  modal() {
    return cy.getByTestId('CopyStopAreaModal::modal');
  }

  getBoilerplateNames() {
    return cy.getByTestId('CopyStopAreaModal::names');
  }

  getBoilerplateValidity() {
    return cy.getByTestId('CopyStopAreaModal::validity');
  }
}
