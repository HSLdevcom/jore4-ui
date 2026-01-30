import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

export class PassingTimesByStopTableRow {
  static passingTime = PassingTimesByStopTableRowPassingTime;

  static getTimeContainerByHour(hour: string) {
    return cy
      .getByTestId('PassingTimesByStopTableRowPassingTime::hour')
      .contains(hour)
      .parent(
        '[data-testid="PassingTimesByStopTableRowPassingTime::timeContainer"]',
      );
  }
}
