import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class TerminalValidityForm {
  validity = new ValidityPeriodForm();

  form() {
    return cy.getByTestId('TerminalValidityForm::form');
  }

  versionName() {
    return cy.getByTestId('TerminalValidityForm::versionName');
  }

  versionDescription() {
    return cy.getByTestId('TerminalValidityForm::versionDescription');
  }

  submitButton() {
    return cy.getByTestId('TerminalValidityForm::submitButton');
  }

  cancelButton() {
    return cy.getByTestId('TerminalValidityForm::cancelButton');
  }
}
