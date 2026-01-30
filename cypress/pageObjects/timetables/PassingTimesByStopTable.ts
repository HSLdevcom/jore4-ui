import { PassingTimesByStopTableRow } from './PassingTimesByStopTableRow';
import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

export class PassingTimesByStopTable {
  static vehicleJourneyGroupInfo = VehicleJourneyGroupInfo;

  static row = PassingTimesByStopTableRow;

  static getTable() {
    return cy.getByTestId('PassingTimesByStopTable::table');
  }

  static getStopRow(stopLabel: string) {
    return PassingTimesByStopTable.getTable().findByTestId(
      `PassingTimesByStopTableRow::${stopLabel}`,
    );
  }

  static getAllHighlightedElements() {
    return PassingTimesByStopTable.getTable().find('[data-highlighted="true"]');
  }

  static getAllPassingTimeArrivalTimes() {
    return cy.getByTestId(
      'PassingTimesByStopTableRowPassingMinute::arrivalTime',
    );
  }
}
