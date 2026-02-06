export class ObservationPeriodForm {
  static getStartDateInput() {
    return cy.getByTestId('ObservationPeriodForm::startDate');
  }

  static getEndDateInput() {
    return cy.getByTestId('ObservationPeriodForm::endDate');
  }

  static setStartDate(isoDate: string) {
    ObservationPeriodForm.getStartDateInput().type(isoDate);
  }

  static setEndDate(isoDate: string) {
    ObservationPeriodForm.getEndDateInput().type(isoDate);
  }

  static setObservationPeriod(startDate: string, endDate: string) {
    ObservationPeriodForm.setStartDate(startDate);
    ObservationPeriodForm.setEndDate(endDate);
  }
}
