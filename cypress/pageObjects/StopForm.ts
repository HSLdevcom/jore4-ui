import {
  ChangeValidityForm,
  ChangeValidityFormInfo,
} from './ChangeValidityForm';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';

export interface StopFormInfo extends ChangeValidityFormInfo {
  label: string;
  longitude?: string;
  latitude?: string;
}

export class StopForm {
  changeValidityForm = new ChangeValidityForm();

  createTimingPlaceForm = new CreateTimingPlaceForm();

  getLabelInput() {
    return cy.getByTestId('StopFormComponent::label');
  }

  getLongitudeInput() {
    return cy.getByTestId('StopFormComponent::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('StopFormComponent::latitude');
  }

  getTimingPlaceDropdown() {
    return cy.getByTestId('StopFormComponent::timingPlaceDropdown');
  }

  getAddTimingPlaceButton() {
    return cy.getByTestId('StopFormComponent::addTimingPlaceButton');
  }

  selectTimingPlace(timingPlaceName: string) {
    this.getTimingPlaceDropdown().click();
    this.getTimingPlaceDropdown().find('li').contains(timingPlaceName).click();
  }

  fillForm(values: StopFormInfo) {
    this.getLabelInput().clear().type(values.label);
    if (values.latitude) {
      this.getLatitudeInput().clear().type(values.latitude);
    }
    if (values.longitude) {
      this.getLongitudeInput().clear().type(values.longitude);
    }
    this.changeValidityForm.fillForm(values);
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditStopModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
