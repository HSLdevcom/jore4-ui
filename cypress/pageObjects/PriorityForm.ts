import { Priority } from '@hsl/jore4-test-db-manager';

export interface PriorityFormInfo {
  priority?: Priority;
}

export class PriorityForm {
  setAsStandard() {
    return cy
      .getByTestId('PriorityForm::standardPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsDraft() {
    return cy
      .getByTestId('PriorityForm::draftPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsTemporary() {
    return cy
      .getByTestId('PriorityForm::temporaryPriorityButton')
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

  assertSelectedPriority(priority: Priority | undefined) {
    switch (priority) {
      case Priority.Draft:
        cy.getByTestId('PriorityForm::draftPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      case Priority.Temporary:
        cy.getByTestId('PriorityForm::temporaryPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      case Priority.Standard:
        cy.getByTestId('PriorityForm::standardPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }
}
