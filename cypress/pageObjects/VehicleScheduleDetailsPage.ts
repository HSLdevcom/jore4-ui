import { DayTypeDropdown } from './DayTypeDropdown';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';
import { RouteTimetableList } from './RouteTimetableList';

export class VehicleScheduleDetailsPage {
  passingTimesByStopTable = new PassingTimesByStopTable();

  dayTypeDropDown = new DayTypeDropdown();

  routeTimetableList = new RouteTimetableList();

  getArrivalTimesSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showArrivalTimesSwitch');
  }

  getShowAllValidSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showAllValidSwitch');
  }
}
