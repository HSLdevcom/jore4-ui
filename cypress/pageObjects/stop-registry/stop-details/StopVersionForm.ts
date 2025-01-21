import { PriorityForm } from '../../PriorityForm';
import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class StopVersionForm {
  priority = new PriorityForm();

  validity = new ValidityPeriodForm();

  form() {
    return cy.getByTestId('StopVersionForm::form');
  }

  versionName() {
    return cy.getByTestId('StopVersionForm::versionName');
  }

  versionDescription() {
    return cy.getByTestId('StopVersionForm::versionDescription');
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
