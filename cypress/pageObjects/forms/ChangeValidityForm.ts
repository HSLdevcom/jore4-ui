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

  static setAsStandard() {
    return ChangeValidityForm.getContainer()
      .findByTestId('PriorityForm::standardPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setAsDraft() {
    return ChangeValidityForm.getContainer()
      .findByTestId('PriorityForm::draftPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setAsTemporary() {
    return ChangeValidityForm.getContainer()
      .findByTestId('PriorityForm::temporaryPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static setPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.Draft:
        ChangeValidityForm.setAsDraft();
        break;
      case Priority.Temporary:
        ChangeValidityForm.setAsTemporary();
        break;
      case Priority.Standard:
        ChangeValidityForm.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  };
}
