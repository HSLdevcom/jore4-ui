import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

export class PassingTimesByStopTable {
  passingTimesByStopTableRowPassingTime =
    new PassingTimesByStopTableRowPassingTime();

  getTableRow(stopLabel: string) {
    return cy.getByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }

  /**
   * Click a passing time on a stop's row to highlight
   * passing times on all relevant stop rows for that departure.
   * 'nthPassingTime' begins from 0.
   * @example clickToHighlightNthPassingTimeOnStopRow('TestStop1',3);
   */
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
   * If the arrival time and departure time don't have
   * the same hour, the whole arrival time will be displayed
   * in the arrival time section, including the hour.
   * '09:59', for example.
   * @example assertNthPassingTimeOnStop(
   *       {
   *         stopLabel: stopLabels[1],
   *         nthPassingTime: 0,
   *         hour: '7',
   *         arrivalTime: '12',
   *         departureTime: '13',
   *       }
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
    hour: string;
    arrivalTime?: string;
    departureTime: string;
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

  /**
   * Assert if a passing time is highlighted or not on a stop row.
   * 'nthPassingTime' begins from 0.
   * @example assertNthPassingTimeHighlightOnStopRow(
   *           {
   *            stopLabel: 'TestStop2',
   *            nthPassingTime: 1,
   *            isHighlighted: true,
   *          });
   */
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
