import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export interface PriorityFormInfo {
  priority?: Priority;
}

function getPriorityButton(testId: string) {
  cy.getByTestId(testId).should('exist').scrollIntoView();
  return cy.getByTestId(testId).should('be.visible').and('be.enabled');
}

export class PriorityForm {
  setAsStandard() {
    return getPriorityButton(
      'PriorityForm::standardPriorityButton',
    ).scrollIntoViewAndClick();
  }

  setAsDraft() {
    return getPriorityButton(
      'PriorityForm::draftPriorityButton',
    ).scrollIntoViewAndClick();
  }

  setAsTemporary() {
    return getPriorityButton(
      'PriorityForm::temporaryPriorityButton',
    ).scrollIntoViewAndClick();
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
        cy.getByTestId('PriorityForm::draftPriorityButton').should(
          'be.checked',
        );
        break;
      case Priority.Temporary:
        cy.getByTestId('PriorityForm::temporaryPriorityButton').should(
          'be.checked',
        );
        break;
      case Priority.Standard:
        cy.getByTestId('PriorityForm::standardPriorityButton').should(
          'be.checked',
        );
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }
}
