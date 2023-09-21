export class ObservationPeriodForm {
  getStartDateInput() {
    return cy.getByTestId('ObservationPeriodForm::startDate');
  }

  getEndDateInput() {
    return cy.getByTestId('ObservationPeriodForm::endDate');
  }

  setStartDate(isoDate: string) {
    this.getStartDateInput().type(isoDate);
  }

  setEndDate(isoDate: string) {
    this.getEndDateInput().type(isoDate);
  }
}
