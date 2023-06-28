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
}
