import { PriorityForm } from '../../PriorityForm';
import { ReasonForChangeForm } from '../../ReasonForChangeForm';
import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class StopVersionForm {
  priority = new PriorityForm();

  validity = new ValidityPeriodForm();

  reasonForChange = new ReasonForChangeForm();

  form() {
    return cy.getByTestId('StopVersionForm::form');
  }

  validityError() {
    return cy.getByTestId(
      'ValidationError::message::validityRangeIsValidVirtualField',
    );
  }

  submitButton() {
    return cy.getByTestId('StopVersionForm::submitButton');
  }

  cancelButton() {
    return cy.getByTestId('StopVersionForm::cancelButton');
  }
}
