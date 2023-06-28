import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

export class PassingTimesByStopTable {
  passingTimesByStopTableRowPassingTime =
    new PassingTimesByStopTableRowPassingTime();

  getTableRow(stopLabel: string) {
    return cy.getByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }

  clickToHighlightNthPassingTimeOnStopRow(
    stopLabel: string,
    nthPassingTime: number,
  ) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthPassingTime)
        .within(() => {
          this.passingTimesByStopTableRowPassingTime.passingMinute
            .getHighlightButton()
            .click();
        });
    });
  }

  /**
   * Asserts nth arrival and departure times
   * for a stop. 'nthPassingTime' begins from 0.
   * @example assertNthPassingTimeOnStop(
   *       {
   *         stopLabel: stopLabels[1],
   *         nthPassingTime: 0,
   *         hour: 7,
   *         arrivalTime: '12',
   *         departureTime: '13',
   *       },
   *     )
   */
  assertNthPassingTimeOnStop({
    stopLabel,
    nthPassingTime,
    hour,
    arrivalTime,
    departureTime,
  }: {
    stopLabel: string;
    nthPassingTime: number;
    hour: number;
    // arrivalTime is a string because it can contain
    // the hour, the minute and their separator. '08:59', for example.
    arrivalTime?: string;
    departureTime: number;
  }) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthPassingTime)
        .within(() => {
          this.passingTimesByStopTableRowPassingTime
            .getHour()
            .should('contain', hour);
          this.passingTimesByStopTableRowPassingTime.passingMinute
            .getDepartureTime()
            .should('contain', departureTime);
          if (arrivalTime) {
            this.passingTimesByStopTableRowPassingTime.passingMinute
              .getArrivalTime()
              .should('contain', arrivalTime);
          }
        });
    });
  }

  assertNthPassingTimeHighlightOnStopRow({
    stopLabel,
    nthPassingTime,
    isHighlighted,
  }: {
    stopLabel: string;
    nthPassingTime: number;
    isHighlighted: boolean;
  }) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthPassingTime)
        .within(() => {
          if (isHighlighted) {
            this.passingTimesByStopTableRowPassingTime.passingMinute
              .getHighlightButton()
              .should('have.class', 'bg-city-bicycle-yellow');
          } else {
            this.passingTimesByStopTableRowPassingTime.passingMinute
              .getHighlightButton()
              .should('not.have.class', 'bg-city-bicycle-yellow');
          }
        });
    });
  }
}
