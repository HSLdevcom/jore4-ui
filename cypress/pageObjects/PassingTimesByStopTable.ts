import { PassingTimesByStopTableRowPassingMinute } from './PassingTimesByStopTableRowPassingMinute';
import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

interface StopArrivalOrDepartureTime {
  stopLabel: string;
  nthDeparture: number;
  hour?: number;
  minute?: number;
  isDepartureTime: boolean;
}

export class PassingTimesByStopTable {
  passingTimesByStopTableRowPassingMinute =
    new PassingTimesByStopTableRowPassingMinute();

  passingTimesByStopTableRowPassingTime =
    new PassingTimesByStopTableRowPassingTime();

  getTableRow(stopLabel: string) {
    return cy.getByTestId(`PassingTimesByStopTableRow::${stopLabel}`);
  }

  assertStopNthHour(values: StopArrivalOrDepartureTime) {
    this.getTableRow(values.stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(values.nthDeparture)
        .within(() => {
          this.passingTimesByStopTableRowPassingTime
            .getHour()
            .should('contain', values.hour);
        });
    });
  }

  assertStopNthDepartureOrArrivalMinute(values: StopArrivalOrDepartureTime) {
    this.getTableRow(values.stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(values.nthDeparture)
        .within(() => {
          if (values.isDepartureTime) {
            this.passingTimesByStopTableRowPassingMinute
              .getDepartureTime()
              .should('contain', values.minute);
          } else {
            this.passingTimesByStopTableRowPassingMinute
              .getArrivalTime()
              .should('contain', values.minute);
          }
        });
    });
  }

  assertStopNthDepartureOrArrivalTime(values: StopArrivalOrDepartureTime) {
    this.assertStopNthHour(values);
    this.assertStopNthDepartureOrArrivalMinute(values);
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

  assertNthDepartureHighlightOnStopRow(values: {
    stopLabel: string;
    nthDeparture: number;
    isHighlighted: boolean;
  }) {
    this.getTableRow(values.stopLabel).within(() => {
      this.passingTimesByStopTableRowPassingTime
        .getTimeContainer()
        .eq(values.nthDeparture)
        .within(() => {
          if (values.isHighlighted) {
            this.passingTimesByStopTableRowPassingMinute
              .getHighlightButton()
              .should('have.class', 'bg-city-bicycle-yellow');
          } else {
            this.passingTimesByStopTableRowPassingMinute
              .getHighlightButton()
              .should('not.have.class', 'bg-city-bicycle-yellow');
          }
        });
    });
  }
}
