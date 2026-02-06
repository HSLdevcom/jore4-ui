import { PassingTimesByStopTableRowPassingMinute } from './PassingTimesByStopTableRowPassingMinute';

export class PassingTimesByStopTableRowPassingTime {
  static passingMinute = PassingTimesByStopTableRowPassingMinute;

  static getTimeContainer() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingTime::timeContainer',
    );
  }

  static getHour() {
    return cy.getByTestId('PassingTimesByStopTableRowPassingTime::hour');
  }

  static getTimeContainerByHour(hour: string) {
    return PassingTimesByStopTableRowPassingTime.getHour()
      .contains(hour)
      .parent(
        '[data-testid="PassingTimesByStopTableRowPassingTime::timeContainer"]',
      );
  }

  static assertNthMinuteShouldBeHighlighted(nth: number) {
    return PassingTimesByStopTableRowPassingMinute.getMinute()
      .eq(nth)
      .should('have.attr', 'data-highlighted', 'true');
  }

  static assertTotalMinuteCount(count: number) {
    PassingTimesByStopTableRowPassingMinute.getMinute().should(
      'have.length',
      count,
    );
  }

  static assertNthArrivalTime(nth: number, arrivalTime: string) {
    PassingTimesByStopTableRowPassingMinute.getArrivalTime()
      .eq(nth)
      .should('contain', arrivalTime);
  }

  static assertNthDepartureTime(nth: number, depTime: string) {
    PassingTimesByStopTableRowPassingMinute.getDepartureTime()
      .eq(nth)
      .should('contain', depTime);
  }
}
