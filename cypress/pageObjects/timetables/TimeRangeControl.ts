export class TimeRangeControl {
  static getStartDateInput() {
    return cy.getByTestId('TimeRangeControl::startDate');
  }

  static getEndDateInput() {
    return cy.getByTestId('TimeRangeControl::endDate');
  }

  static setStartDate(isoDate: string) {
    return TimeRangeControl.getStartDateInput().type(isoDate);
  }

  static setEndDate(isoDate: string) {
    return TimeRangeControl.getEndDateInput().type(isoDate);
  }

  static setTimeRange(startDate: string, endDate: string) {
    TimeRangeControl.setStartDate(startDate);
    TimeRangeControl.setEndDate(endDate);
  }
}
