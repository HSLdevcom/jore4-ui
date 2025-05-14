import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { PriorityForm } from './PriorityForm';
import { ValidityPeriodForm } from './ValidityPeriodForm';

export class ChangeValidityForm {
  priorityForm = new PriorityForm();

  validityPeriodForm = new ValidityPeriodForm();

  getContainer() {
    return cy.getByTestId('ChangeValidityForm::container');
  }

  setAsStandard() {
    return this.getContainer()
      .findByTestId('PriorityForm::standardPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsDraft() {
    return this.getContainer()
      .findByTestId('PriorityForm::draftPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsTemporary() {
    return this.getContainer()
      .findByTestId('PriorityForm::temporaryPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.Draft:
        this.setAsDraft();
        break;
      case Priority.Temporary:
        this.setAsTemporary();
        break;
      case Priority.Standard:
        this.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  };
}
