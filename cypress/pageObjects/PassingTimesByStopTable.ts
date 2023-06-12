import { PassingTimesByStopTableRowPassingMinute } from './PassingTimesByStopTableRowPassingMinute';
import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

export class PassingTimesByStopTable {
  passingTimesByStopTableRowPassingMinute =
    new PassingTimesByStopTableRowPassingMinute();

  passingTimesByStopTableRowPassingTime =
    new PassingTimesByStopTableRowPassingTime();

  getTableRow(stopLabel: string) {
    return cy.getByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }

  assertStopHasDepartureTime(
    stopLabel: string,
    nthDeparture: number,
    hour: number,
    departureMinute: number,
  ) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingTime
            .getHour()
            .should('contain', hour);
        });
    });
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingMinute
            .getDepartureTime()
            .should('contain', departureMinute);
        });
    });
  }

  assertStopHasArrivalTime(
    stopLabel: string,
    nthDeparture: number,
    hour: number,
    arrivalMinute: number,
  ) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingTime
            .getHour()
            .should('contain', hour);
        });
    });
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingMinute
            .getArrivalTime()
            .should('contain', arrivalMinute);
        });
    });
  }

  highlightNthDepartureOnStopRow(stopLabel: string, nthDeparture: number) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingMinute
            .getHighlightButton()
            .click();
        });
    });
  }

  assertNthDepartureIsHighlightedOnStopRow(
    stopLabel: string,
    nthDeparture: number,
  ) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingMinute
            .getHighlightButton()
            .should('have.class', 'bg-city-bicycle-yellow');
        });
    });
  }

  assertNthDepartureIsNotHighlightedOnStopRow(
    stopLabel: string,
    nthDeparture: number,
  ) {
    this.getTableRow(stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingMinute
            .getHighlightButton()
            .should('not.have.class', 'bg-city-bicycle-yellow');
        });
    });
  }
}
