import { TerminalValidityForm } from './TerminalValidityForm';

export class EditTerminalValidityModal {
  form = new TerminalValidityForm();

  getModal = () => cy.getByTestId('EditTerminalValidityModal::modal');

  getLoading = () => cy.getByTestId('EditTerminalValidityModal::loading');
}
