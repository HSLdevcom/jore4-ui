export class ChangeTimetablesValidityForm {
  getValidityStartDateInput() {
    return cy.getByTestId('ChangeTimetablesValidityForm::startDateInput');
  }

  getValidityEndDateInput() {
    return cy.getByTestId('ChangeTimetablesValidityForm::endDateInput');
  }

  setValidityStartDate(isoDate: string) {
    this.getValidityStartDateInput().type(isoDate);
  }

  setValidityEndDate(isoDate: string) {
    this.getValidityEndDateInput().type(isoDate);
  }

  getSaveButton() {
    return cy.getByTestId('ChangeTimetablesValidityForm::saveButton');
  }
}
