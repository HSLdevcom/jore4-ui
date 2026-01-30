import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { ChangeTimetablesValidityForm } from '../forms/ChangeTimetablesValidityForm';
import { Toast } from '../shared-components/Toast';
import { ObservationDateControl } from './ObservationDateControl';

export class VehicleScheduleDetailsPage {
  static changeTimetablesValidityForm = ChangeTimetablesValidityForm;

  static toast = Toast;

  static observationDateControl = ObservationDateControl;

  static getArrivalTimesSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showArrivalTimesSwitch');
  }

  static getShowVersionsButton() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showVersionsButton');
  }

  static getShowAllValidSwitch() {
    return cy.getByTestId('VehicleScheduleDetailsPage::showAllValidSwitch');
  }

  static getRouteSectionByLabelAndDirection(
    label: string,
    direction: RouteDirectionEnum,
  ) {
    return cy.getByTestId(
      `RouteTimetablesSection::section::${label}::${direction}`,
    );
  }
}
