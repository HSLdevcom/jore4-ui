import { Priority } from '@hsl/jore4-test-db-manager';

export interface ChangeValidityFormInfo {
  priority?: Priority;
  validityStartISODate?: string;
  validityEndISODate?: string;
}

export class ChangeValidityForm {
  setAsStandard() {
    return cy.getByTestId('PriorityForm::standardPriorityButton').click();
  }

  setAsDraft() {
    return cy.getByTestId('PriorityForm::draftPriorityButton').click();
  }

  setAsTemporary() {
    return cy.getByTestId('PriorityForm::temporaryPriorityButton').click();
  }

  assertSelectedPriority(priority: Priority | undefined) {
    switch (priority) {
      case Priority.Draft:
        cy.getByTestId('ChangeValidityForm::draftPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      case Priority.Temporary:
        cy.getByTestId('ChangeValidityForm::temporaryPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      case Priority.Standard:
        cy.getByTestId('ChangeValidityForm::standardPriorityButton')
          .get('[data-selected="true"]')
          .should('exist');
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
  }

  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return cy
      .getByTestId('ChangeValidityForm::startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  getEndDateInput() {
    return cy.getByTestId('ChangeValidityForm::endDateInput');
  }

  setEndDate = (isoDate?: string) => {
    if (isoDate) {
      this.setAsIndefinite(false);
      // This invoke is a workaround to
      // prevent map from zooming out when typing '-' value to the date input
      this.getEndDateInput().invoke('removeAttr', 'type').type(isoDate);
    } else {
      this.setAsIndefinite();
    }
  };

  getIndefiniteCheckbox() {
    return cy.getByTestId('ChangeValidityForm::indefiniteCheckbox');
  }

  setAsIndefinite(indefinite = true) {
    return indefinite
      ? this.getIndefiniteCheckbox().check()
      : this.getIndefiniteCheckbox().uncheck();
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

  fillForm(values: ChangeValidityFormInfo) {
    if (values.priority) {
      this.setPriority(values.priority);
    }
    if (values.validityStartISODate) {
      this.setStartDate(values.validityStartISODate);
    }
    this.setEndDate(values.validityEndISODate);
  }
}
