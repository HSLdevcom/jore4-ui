import { ReasonForChangeForm } from '../../ReasonForChangeForm';
import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class CopyStopAreaForm {
  validity = new ValidityPeriodForm();

  reasonForChange = new ReasonForChangeForm();

  getForm() {
    return cy.getByTestId('CopyStopAreaForm::form');
  }

  getSubmitButton() {
    return cy.getByTestId('CopyStopAreaForm::submitButton');
  }

  getCancelButton() {
    return cy.getByTestId('CopyStopAreaForm::cancelButton');
  }
}
