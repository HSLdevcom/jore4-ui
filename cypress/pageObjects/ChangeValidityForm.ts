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
    return cy
      .getByTestId('ChangeValidityForm::startDateInput')
      .clear()
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

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
