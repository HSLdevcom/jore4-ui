import { Priority } from '@hsl/jore4-test-db-manager';

export interface ConfirmSaveFormInfo {
  priority: Priority;
  validityStartISODate: string;
  validityEndISODate?: string;
}

export class ConfirmSaveForm {
  setAsStandard() {
    return cy.getByTestId('ConfirmSaveForm::standardPriorityButton').click();
  }

  setAsDraft() {
    return cy.getByTestId('ConfirmSaveForm::draftPriorityButton').click();
  }

  setAsTemporary() {
    return cy.getByTestId('ConfirmSaveForm::temporaryPriorityButton').click();
  }

  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    return cy
      .getByTestId('ConfirmSaveForm::startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  getEndDateInput() {
    return cy.getByTestId('ConfirmSaveForm::endDateInput');
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
    return cy.getByTestId('ConfirmSaveForm::indefiniteCheckbox');
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

  fillForm(values: ConfirmSaveFormInfo) {
    this.setPriority(values.priority);
    this.setStartDate(values.validityStartISODate);
    this.setEndDate(values.validityEndISODate);
  }
}
