import { ChangeTimetablesValidityForm } from './ChangeTimetablesValidityForm';
import { DayTypeDropdown } from './DayTypeDropdown';
import { ObservationDateControl } from './ObservationDateControl';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';
import { RouteTimetableList } from './RouteTimetableList';
import { Toast } from './Toast';
import { VehicleJourneyGroupInfo } from './VehicleJourneyGroupInfo';

export class VehicleScheduleDetailsPage {
  passingTimesByStopTable = new PassingTimesByStopTable();

  dayTypeDropDown = new DayTypeDropdown();

  routeTimetableList = new RouteTimetableList();

  vehicleJourneyGroupInfo = new VehicleJourneyGroupInfo();

  changeTimetablesValidityForm = new ChangeTimetablesValidityForm();

  toast = new Toast();

  observationDateControl = new ObservationDateControl();

  getArrivalTimesSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showArrivalTimesSwitch');
  }
}
