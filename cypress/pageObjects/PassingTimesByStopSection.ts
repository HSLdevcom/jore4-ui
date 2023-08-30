import { TimetablePriority } from '@hsl/jore4-test-db-manager';
import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';
import { ParentPageObject } from './types';

export class PassingTimesByStopSection {
  getParent: ParentPageObject['get'];

  dayType: string;

  priority: TimetablePriority;

  passingTimesByStopTableRowPassingTime =
    new PassingTimesByStopTableRowPassingTime();

  constructor(
    parent: ParentPageObject,
    dayType: string,
    priority: TimetablePriority,
  ) {
    this.getParent = () => parent.get();
    this.dayType = dayType;
    this.priority = priority;
  }

  get() {
    return this.getParent().findByTestId(
      `PassingTimesByStopSection::${this.dayType}::${this.priority}`,
    );
  }

  clickChangeValidityDate() {
    return this.get()
      .findByTestId('VehicleJourneyGroupInfo::changeValidityButton')
      .click();
  }

  getDayTypeDropdownButton() {
    return this.get().findByTestId('DayTypeDropdown::button');
  }

  getTableRow(stopLabel: string) {
    return this.get().findByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }

  /**
   * Asserts nth arrival and departure times
   * for a stop. 'nthPassingTime' begins from 0.
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
