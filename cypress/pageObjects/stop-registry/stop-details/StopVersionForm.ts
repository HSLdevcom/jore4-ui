import { PriorityForm } from '../../forms/PriorityForm';
import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';
import { ValidityPeriodForm } from '../../forms/ValidityPeriodForm';

export class StopVersionForm {
  static priority = PriorityForm;

  static validity = ValidityPeriodForm;

  static reasonForChange = ReasonForChangeForm;

  static form() {
    return cy.getByTestId('StopVersionForm::form');
  }

  static validityError() {
    return cy.getByTestId(
      'ValidationError::message::validityRangeIsValidVirtualField',
    );
  }

  static submitButton() {
    return cy.getByTestId('StopVersionForm::submitButton');
  }

  static cancelButton() {
    return cy.getByTestId('StopVersionForm::cancelButton');
  }
}
