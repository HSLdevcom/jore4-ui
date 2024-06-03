import { PassingTimesByStopTableRow } from './PassingTimesByStopTableRow';

export class PassingTimesByStopTable {
  row = new PassingTimesByStopTableRow();

  getTable() {
    return cy.getByTestId('PassingTimesByStopTable::table');
  }

  getStopRow(stopLabel: string) {
    return this.getTable().findByTestId(
      `PassingTimesByStopTableRow::${stopLabel}`,
    );
  }

  getAllHighlightedElements() {
    return this.getTable().find('[data-highlighted="true"]');
  }

  getAllPassingTimeArrivalTimes() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::arrivalTime',
    );
  }
}
