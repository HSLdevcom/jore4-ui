export interface ValidityPeriodFormInfo {
  validityStartISODate?: string;
  validityEndISODate?: string;
}

export class ValidityPeriodForm {
  setStartDate(isoDate: string) {
    return cy
      .getByTestId('ValidityPeriodForm::startDateInput')
      .clearAndType(isoDate);
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
      this.getEndDateInput().clearAndType(isoDate);
    } else {
      this.setAsIndefinite();
    }
  };

  getIndefiniteCheckbox() {
    cy.getByTestId('ValidityPeriodForm::indefiniteCheckbox').scrollIntoView();
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
