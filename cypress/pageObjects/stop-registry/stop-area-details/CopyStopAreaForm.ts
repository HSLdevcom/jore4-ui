import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';
import { ValidityPeriodForm } from '../../forms/ValidityPeriodForm';

export class CopyStopAreaForm {
  static validity = ValidityPeriodForm;

  static reasonForChange = ReasonForChangeForm;

  static getForm() {
    return cy.getByTestId('CopyStopAreaForm::form');
  }

  static getSubmitButton() {
    return cy.getByTestId('CopyStopAreaForm::submitButton');
  }

  static getCancelButton() {
    return cy.getByTestId('CopyStopAreaForm::cancelButton');
  }
}
