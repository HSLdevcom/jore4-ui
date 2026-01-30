import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export interface PriorityFormInfo {
  priority?: Priority;
}

function getPriorityButton(testId: string) {
  cy.getByTestId(testId).should('exist').scrollIntoView();
  return cy.getByTestId(testId).should('be.visible').and('be.enabled');
}

export class PriorityForm {
  static setAsStandard() {
    return getPriorityButton(
      'PriorityForm::standardPriorityButton',
    ).scrollIntoViewAndClick();
  }

  static setAsDraft() {
    return getPriorityButton(
      'PriorityForm::draftPriorityButton',
    ).scrollIntoViewAndClick();
  }

  static setAsTemporary() {
    return getPriorityButton(
      'PriorityForm::temporaryPriorityButton',
    ).scrollIntoViewAndClick();
  }

  static setPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.Draft:
        PriorityForm.setAsDraft();
        break;
      case Priority.Temporary:
        PriorityForm.setAsTemporary();
        break;
      case Priority.Standard:
        PriorityForm.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  };

  static assertSelectedPriority(priority: Priority | undefined) {
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
