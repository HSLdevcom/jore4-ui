import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';
import { ValidityPeriodForm } from '../../forms/ValidityPeriodForm';

export class TerminalValidityForm {
  static validity = ValidityPeriodForm;

  static reasonForChange = ReasonForChangeForm;

  static form() {
    return cy.getByTestId('TerminalValidityForm::form');
  }

  static submitButton() {
    return cy.getByTestId('TerminalValidityForm::submitButton');
  }

  static cancelButton() {
    return cy.getByTestId('TerminalValidityForm::cancelButton');
  }
}
