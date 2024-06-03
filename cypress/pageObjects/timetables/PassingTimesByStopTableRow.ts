import { PassingTimesByStopTableRowPassingTime } from '../PassingTimesByStopTableRowPassingTime';

export class PassingTimesByStopTableRow {
  passingTime = new PassingTimesByStopTableRowPassingTime();

  getTimeContainerByHour(hour: string) {
    return cy
      .getByTestId('PassingTimesByStopTableRowPassingTime::hour')
      .contains(hour)
      .parent(
        '[data-testid="PassingTimesByStopTableRowPassingTime::timeContainer"]',
      );
  }
}
