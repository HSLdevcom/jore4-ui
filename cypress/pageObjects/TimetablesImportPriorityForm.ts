import { TimetablePriority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export interface PriorityFormInfo {
  priority?: TimetablePriority;
}

export class TimetablesImportPriorityForm {
  getStandardPriorityButton() {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::standardPriorityButton',
    );
  }

  getDraftPriorityButton() {
    return cy.getByTestId('TimetablesImportPriorityForm::draftPriorityButton');
  }

  getTemporaryPriorityButton() {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::temporaryPriorityButton',
    );
  }

  getSpecialDayPriorityButton = () => {
    return cy.getByTestId(
      'TimetablesImportPriorityForm::specialDayPriorityButton',
    );
  };

  setAsStandard() {
    return this.getStandardPriorityButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsDraft() {
    return this.getDraftPriorityButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  setAsTemporary() {
    return this.getTemporaryPriorityButton()
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

  assertSelectedPriority(priority: TimetablePriority | undefined) {
    switch (priority) {
      case TimetablePriority.Draft:
        this.getDraftPriorityButton().should('be.checked');
        break;
      case TimetablePriority.Temporary:
        this.getTemporaryPriorityButton().should('be.checked');
        break;
      case TimetablePriority.Standard:
        this.getStandardPriorityButton().should('be.checked');
        break;
      case TimetablePriority.Special:
        this.getSpecialDayPriorityButton().should('be.checked');
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }
}
