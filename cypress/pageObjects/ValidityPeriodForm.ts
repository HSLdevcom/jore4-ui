export interface ValidityPeriodFormInfo {
  validityStartISODate?: string;
  validityEndISODate?: string;
}

export class ValidityPeriodForm {
  setStartDate(isoDate: string) {
    // This invoke is a workaround to
    // prevent map from zooming out when typing '-' value to the date input
    cy.getByTestId('ValidityPeriodForm::startDateInput').clear();

    return cy
      .getByTestId('ValidityPeriodForm::startDateInput')
      .invoke('removeAttr', 'type')
      .type(isoDate);
  }

  getStartDateInput() {
    return cy.getByTestId('ValidityPeriodForm::startDateInput');
  }

  getEndDateInput() {
    return cy.getByTestId('ValidityPeriodForm::endDateInput');
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
    return cy.getByTestId('ValidityPeriodForm::indefiniteCheckbox');
  }

  setAsIndefinite(indefinite = true) {
    return indefinite
      ? this.getIndefiniteCheckbox().check()
      : this.getIndefiniteCheckbox().uncheck();
  }

  fillForm(values: ValidityPeriodFormInfo) {
    if (values.validityStartISODate) {
      this.setStartDate(values.validityStartISODate);
    }
    this.setEndDate(values.validityEndISODate);
  }

  getEndDateValidityError() {
    return cy.getByTestId('ValidationError::message::validityEnd');
  }
}
