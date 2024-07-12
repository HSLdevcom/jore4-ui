import { Priority } from '@hsl/jore4-test-db-manager';
import { PriorityForm } from './PriorityForm';

export interface ChangeValidityFormInfo {
  validityStartISODate?: string;
  validityEndISODate?: string;
}

export class ChangeValidityForm {
  priorityForm = new PriorityForm();

  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    this.getStartDateInput().clear();
    this.getStartDateInput().invoke('removeAttr', 'type');
    this.getStartDateInput().type(isoDate);
    return this.getStartDateInput();
  }

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

  getStartDateInput() {
    return cy.getByTestId('ChangeValidityForm::startDateInput');
  }

  getEndDateInput() {
    return cy.getByTestId('ChangeValidityForm::endDateInput');
  }

  setEndDate = (isoDate?: string) => {
    if (isoDate) {
      this.setAsIndefinite(false);
      // This invoke is a workaround to
      // prevent map from zooming out when typing '-' value to the date input
      this.getEndDateInput().clear().invoke('removeAttr', 'type').type(isoDate);
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

  fillForm(values: ChangeValidityFormInfo) {
    if (values.validityStartISODate) {
      this.setStartDate(values.validityStartISODate);
    }
    this.setEndDate(values.validityEndISODate);
  }
}
