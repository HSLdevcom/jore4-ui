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

  submitButton() {
    return cy.getByTestId('StopVersionForm::submitButton');
  }

  cancelButton() {
    return cy.getByTestId('StopVersionForm::cancelButton');
  }
}
