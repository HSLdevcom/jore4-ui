import { TerminalValidityForm } from './TerminalValidityForm';

export class EditTerminalValidityModal {
  static form = TerminalValidityForm;

  static getModal = () => cy.getByTestId('EditTerminalValidityModal::modal');

  static getLoading = () =>
    cy.getByTestId('EditTerminalValidityModal::loading');
}
