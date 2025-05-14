import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { ChangeTimetablesValidityForm } from './ChangeTimetablesValidityForm';
import { ObservationDateControl } from './ObservationDateControl';
import { Toast } from './Toast';

export class VehicleScheduleDetailsPage {
  changeTimetablesValidityForm = new ChangeTimetablesValidityForm();

  toast = new Toast();

  observationDateControl = new ObservationDateControl();

  getArrivalTimesSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showArrivalTimesSwitch');
  }

  getShowVersionsButton() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showVersionsButton');
  }

  getShowAllValidSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showAllValidSwitch');
  }

  getRouteSectionByLabelAndDirection(
    label: string,
    direction: RouteDirectionEnum,
  ) {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${label}::${direction}`,
    );
  }
}
