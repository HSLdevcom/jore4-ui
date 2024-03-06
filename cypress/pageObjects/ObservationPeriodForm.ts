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

  setObservationPeriod(startDate: string, endDate: string) {
    this.setStartDate(startDate);
    this.setEndDate(endDate);
  }
}
