export class ChangeTimetablesValidityForm {
  static getValidityStartDateInput() {
    return cy.getByTestId('ChangeTimetablesValidityForm::startDateInput');
  }

  static getValidityEndDateInput() {
    return cy.getByTestId('ChangeTimetablesValidityForm::endDateInput');
  }

  static setValidityStartDate(isoDate: string) {
    ChangeTimetablesValidityForm.getValidityStartDateInput().type(isoDate);
  }

  static setValidityEndDate(isoDate: string) {
    ChangeTimetablesValidityForm.getValidityEndDateInput().type(isoDate);
  }

  static getSaveButton() {
    return cy.getByTestId('ChangeTimetablesValidityForm::saveButton');
  }
}
