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
}
