export class PassingTimesByStopTable {
  getTable() {
    return cy.getByTestId('PassingTimesByStopTable::table');
  }

  getStopRow(stopLabel: string) {
    return this.getTable().findByTestId(
      `PassingTimesByStopTableRow::${stopLabel}`,
    );
  }

  getAllStopPassingTimesMinuteButtons(stopLabel: string) {
    return this.getStopRow(stopLabel).findByTestId(
      'PassingTimesByStopTableRowPassingMinute::button',
    );
  }

  getHighlightedElements() {
    return this.getTable().find('[data-highlighted="true"]');
  }

  assertStopNthPassingTimeShouldBeHighlighted(stopLabel: string, nth: number) {
    this.getAllStopPassingTimesMinuteButtons(stopLabel)
      .eq(nth)
      .should('have.attr', 'data-highlighted', 'true');
  }

  getStopNthPassingTimesArrivalTime(stopLabel: string, nth: number) {
    return this.getAllStopPassingTimesMinuteButtons(stopLabel)
      .eq(nth)
      .findByTestId('PassingTimesByStopTableRowPassingMinute::arrivalTime');
  }

  getAllPassingTimeArrivalTimes() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::arrivalTime',
    );
  }
}
