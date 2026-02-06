export interface ValidityPeriodFormInfo {
  validityStartISODate?: string;
  validityEndISODate?: string;
}

export class ValidityPeriodForm {
  static setStartDate(isoDate: string) {
    return cy
      .getByTestId('ValidityPeriodForm::startDateInput')
      .clearAndType(isoDate);
  }

  static getStartDateInput() {
    return cy.getByTestId('ValidityPeriodForm::startDateInput');
  }

  static getEndDateInput() {
    return cy.getByTestId('ValidityPeriodForm::endDateInput');
  }

  static setEndDate = (isoDate?: string) => {
    if (isoDate) {
      ValidityPeriodForm.setAsIndefinite(false);
      ValidityPeriodForm.getEndDateInput().clearAndType(isoDate);
    } else {
      ValidityPeriodForm.setAsIndefinite();
    }
  };

  static getIndefiniteCheckbox() {
    cy.getByTestId('ValidityPeriodForm::indefiniteCheckbox').scrollIntoView();
    return cy.getByTestId('ValidityPeriodForm::indefiniteCheckbox');
  }

  static setAsIndefinite(indefinite = true) {
    return indefinite
      ? ValidityPeriodForm.getIndefiniteCheckbox().check()
      : ValidityPeriodForm.getIndefiniteCheckbox().uncheck();
  }

  static fillForm(values: ValidityPeriodFormInfo) {
    if (values.validityStartISODate) {
      ValidityPeriodForm.setStartDate(values.validityStartISODate);
    }
    ValidityPeriodForm.setEndDate(values.validityEndISODate);
  }

  static getEndDateValidityError() {
    return cy.getByTestId('ValidationError::message::validityEnd');
  }
}
