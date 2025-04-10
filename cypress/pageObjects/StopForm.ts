import { expectGraphQLCallToSucceed } from '../utils/assertions';
import { ChangeValidityForm } from './ChangeValidityForm';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import { ValidityPeriodFormInfo } from './ValidityPeriodForm';

export interface BaseStopFormInfo
  extends ValidityPeriodFormInfo,
    PriorityFormInfo {
  locationFin?: string;
  locationSwe?: string;
  longitude?: string;
  latitude?: string;
  timingPlace?: string;
  versionName?: string;
  versionDescription?: string;
}

export interface NewStopFormInfo extends BaseStopFormInfo {
  label: string;
  stopPlace: string;
}

export class StopForm {
  changeValidityForm = new ChangeValidityForm();

  createTimingPlaceForm = new CreateTimingPlaceForm();

  priorityForm = new PriorityForm();

  getLabelInput() {
    return cy.getByTestId('StopFormComponent::label');
  }

  getStopAreaInput() {
    return cy.getByTestId('FindStopArea::input');
  }

  getStopAreaResult(privateCode: string) {
    return cy.getByTestId(`FindStopArea::stopArea::${privateCode}`);
  }

  getLongitudeInput() {
    return cy.getByTestId('StopFormComponent::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('StopFormComponent::latitude');
  }

  getLocationFinInput() {
    return cy.getByTestId('StopFormComponent::locationFin');
  }

  getLocationSweInput() {
    return cy.getByTestId('StopFormComponent::locationSwe');
  }

  getTimingPlaceDropdown() {
    return cy.getByTestId('StopFormComponent::timingPlaceDropdown');
  }

  getAddTimingPlaceButton() {
    return cy.getByTestId('StopFormComponent::addTimingPlaceButton');
  }

  selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    this.getTimingPlaceDropdown().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');
    this.getTimingPlaceDropdown()
      .find('[role="option"]')
      .contains(timingPlaceName)
      .click();
  }

  fillBaseForm(values: BaseStopFormInfo) {
    if (values.locationFin) {
      this.getLocationFinInput().clearAndType(values.locationFin);
    }

    if (values.locationSwe) {
      this.getLocationSweInput().clearAndType(values.locationSwe);
    }

    if (values.latitude) {
      this.getLatitudeInput().clearAndType(values.latitude);
    }

    if (values.longitude) {
      this.getLongitudeInput().clearAndType(values.longitude);
    }

    if (values.timingPlace) {
      this.selectTimingPlace(values.timingPlace);
    }

    if (values.priority) {
      this.priorityForm.setPriority(values.priority);
    }

    this.changeValidityForm.validityPeriodForm.fillForm(values);
  }

  fillFormForNewStop(values: NewStopFormInfo) {
    this.getLabelInput().clear().type(values.label);

    this.getStopAreaInput().clearAndType(values.stopPlace);
    this.getStopAreaResult(values.stopPlace).click();

    this.fillBaseForm(values);
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
