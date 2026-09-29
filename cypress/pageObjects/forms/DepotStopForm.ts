import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import {
  ValidityPeriodForm,
  ValidityPeriodFormInfo,
} from './ValidityPeriodForm';

export interface NewDepotStopFormInfo extends ValidityPeriodFormInfo {
  label: string;
  latitude: string;
  longitude: string;
  timingPlace?: string;
}

export class DepotStopForm {
  static getModal() {
    return cy.getByTestId('DepotStopModal');
  }

  static getLabelInput() {
    return cy.getByTestId('DepotStopForm::label');
  }

  static getLatitudeInput() {
    return cy.getByTestId('DepotStopForm::latitude');
  }

  static getLongitudeInput() {
    return cy.getByTestId('DepotStopForm::longitude');
  }

  static getTimingPlaceDropdown() {
    return cy.getByTestId('StopFormComponent::timingPlaceDropdown');
  }

  static selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    DepotStopForm.getTimingPlaceDropdown().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');
    cy.get('[role="option"]').contains(timingPlaceName).click();
  }

  static fillFormForNewDepotStop(values: NewDepotStopFormInfo) {
    DepotStopForm.getLabelInput().clearAndType(values.label);
    DepotStopForm.getLatitudeInput().clearAndType(values.latitude);
    DepotStopForm.getLongitudeInput().clearAndType(values.longitude);

    if (values.timingPlace) {
      DepotStopForm.selectTimingPlace(values.timingPlace);
    }

    ValidityPeriodForm.fillForm(values);
  }

  static save() {
    return DepotStopForm.getModal()
      .findByTestId('DepotStopForm::saveButton')
      .click();
  }

  static cancel() {
    return DepotStopForm.getModal()
      .findByTestId('DepotStopForm::cancelButton')
      .click();
  }
}
