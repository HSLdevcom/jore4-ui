import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { PriorityForm } from './PriorityForm';
import { ValidityPeriodForm } from './ValidityPeriodForm';

export class ChangeValidityForm {
  static priorityForm = PriorityForm;

  static validityPeriodForm = ValidityPeriodForm;

  static getContainer() {
    cy.getByTestId('ChangeValidityForm::container').scrollIntoView();
    return cy.getByTestId('ChangeValidityForm::container');
  }

  static setPriority = (priority: Priority) =>
    ChangeValidityForm.getContainer().within(() =>
      PriorityForm.setPriority(priority),
    );
}
