import { ChangeTimetablesValidityForm } from './ChangeTimetablesValidityForm';
import { DayTypeDropdown } from './DayTypeDropdown';
import { ObservationDateControl } from './ObservationDateControl';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';
import { Toast } from './Toast';

export class VehicleScheduleDetailsPage {
  passingTimesByStopTable = new PassingTimesByStopTable();

  dayTypeDropDown = new DayTypeDropdown();

  changeTimetablesValidityForm = new ChangeTimetablesValidityForm();

  toast = new Toast();

  observationDateControl = new ObservationDateControl();

  getArrivalTimesSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showArrivalTimesSwitch');
  }
}
