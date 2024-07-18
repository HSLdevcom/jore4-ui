import { PassingTimesByStopTableRowPassingMinute } from './PassingTimesByStopTableRowPassingMinute';

export class PassingTimesByStopTableRowPassingTime {
  passingMinute = new PassingTimesByStopTableRowPassingMinute();

  getTimeContainer() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingTime::timeContainer',
    );
  }

  getHour() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingTime::hour');
  }

  getTimeContainerByHour(hour: string) {
    return this.getHour()
      .contains(hour)
      .parent(
        '[data-testid="PassingTimesByStopTableRowPassingTime::timeContainer"]',
      );
  }

  assertNthMinuteShouldBeHighlighted(nth: number) {
    return this.passingMinute
      .getMinute()
      .eq(nth)
      .should('have.attr', 'data-highlighted', 'true');
  }

  assertTotalMinuteCount(count: number) {
    this.passingMinute.getMinute().should('have.length', count);
  }

  assertNthArrivalTime(nth: number, arrivalTime: string) {
    this.passingMinute.getArrivalTime().eq(nth).should('contain', arrivalTime);
  }

  assertNthDepartureTime(nth: number, depTime: string) {
    this.passingMinute.getDepartureTime().eq(nth).should('contain', depTime);
  }
}
