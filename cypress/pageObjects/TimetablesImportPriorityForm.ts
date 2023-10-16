import { TimetablePriority } from '@hsl/jore4-test-db-manager';

export interface PriorityFormInfo {
  priority?: TimetablePriority;
}

export class TimetablesImportPriorityForm {
  setAsStandard() {
    return cy
      .getByTestId('TimetablesImportPriorityForm::standardPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsDraft() {
    return cy
      .getByTestId('TimetablesImportPriorityForm::draftPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsTemporary() {
    return cy
      .getByTestId('TimetablesImportPriorityForm::temporaryPriorityButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setPriority = (priority: TimetablePriority) => {
    switch (priority) {
      case TimetablePriority.Draft:
        this.setAsDraft();
        break;
      case TimetablePriority.Temporary:
        this.setAsTemporary();
        break;
      case TimetablePriority.Standard:
        this.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  };

  getSpecialDayPriorityCheckbox = () => {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::specialDayPriorityButton',
    );
  };

  assertSelectedPriority(priority: TimetablePriority | undefined) {
    switch (priority) {
      case TimetablePriority.Draft:
        cy.getByTestId(
          'TimetablesImportPriorityForm::draftPriorityButton',
        ).should('have.attr', 'data-selected', 'true');
        break;
      case TimetablePriority.Temporary:
        cy.getByTestId(
          'TimetablesImportPriorityForm::temporaryPriorityButton',
        ).should('have.attr', 'data-selected', 'true');
        break;
      case TimetablePriority.Standard:
        cy.getByTestId(
          'TimetablesImportPriorityForm::standardPriorityButton',
        ).should('have.attr', 'data-selected', 'true');
        break;
      case TimetablePriority.Special:
        this.getSpecialDayPriorityCheckbox().should(
          'have.attr',
          'data-selected',
          'true',
        );
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }
}
