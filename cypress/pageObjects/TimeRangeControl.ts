export class TimeRangeControl {
  getStartDateInput() {
    return cy.getByTestId('TimeRangeControl::startDate');
  }

  getEndDateInput() {
    return cy.getByTestId('TimeRangeControl::endDate');
  }

  setStartDate(isoDate: string) {
    return this.getStartDateInput().type(isoDate);
  }

  setEndDate(isoDate: string) {
    return this.getEndDateInput().type(isoDate);
  }

  setTimeRange(startDate: string, endDate: string) {
    this.setStartDate(startDate);
    this.setEndDate(endDate);
  }
}
