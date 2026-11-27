import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export interface PriorityFormInfo {
  priority?: Priority;
}

function getPriorityButton(testId: string) {
  cy.getByTestId(testId).should('exist').scrollIntoView();
  return cy.getByTestId(testId).should('be.visible').and('be.enabled');
}

const priorityButtonTestId = (priority: Priority) =>
  `PriorityForm::${Priority[priority].toLowerCase()}PriorityButton`;

export class PriorityForm {
  static setPriority = (priority: Priority) =>
    getPriorityButton(priorityButtonTestId(priority)).scrollIntoViewAndClick();

  static setAsStandard = () => PriorityForm.setPriority(Priority.Standard);

  static setAsTemporary = () => PriorityForm.setPriority(Priority.Temporary);

  static setAsDraft = () => PriorityForm.setPriority(Priority.Draft);

  static assertSelectedPriority(priority: Priority | undefined) {
    if (priority === undefined) {
      throw new Error('Priority must be given');
    }
    cy.getByTestId(priorityButtonTestId(priority)).should('be.checked');
  }
}
