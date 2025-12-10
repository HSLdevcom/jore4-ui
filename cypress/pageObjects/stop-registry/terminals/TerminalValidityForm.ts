import { ReasonForChangeForm } from '../../ReasonForChangeForm';
import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class TerminalValidityForm {
  validity = new ValidityPeriodForm();

  reasonForChange = new ReasonForChangeForm();

  form() {
    return cy.getByTestId('TerminalValidityForm::form');
  }

  submitButton() {
    return cy.getByTestId('TerminalValidityForm::submitButton');
  }

  cancelButton() {
    return cy.getByTestId('TerminalValidityForm::cancelButton');
  }
}
