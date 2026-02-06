import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { ChangeValidityForm } from './ChangeValidityForm';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import { ReasonForChangeForm } from './ReasonForChangeForm';
import {
  ValidityPeriodForm,
  ValidityPeriodFormInfo,
} from './ValidityPeriodForm';

export interface BaseStopFormInfo
  extends ValidityPeriodFormInfo, PriorityFormInfo {
  locationFin?: string;
  locationSwe?: string;
  longitude?: string;
  latitude?: string;
  timingPlace?: string;
  reasonForChange?: string | null;
}

export interface NewStopFormInfo extends BaseStopFormInfo {
  publicCode: string;
  stopPlace?: string;
}

export class StopForm {
  static changeValidityForm = ChangeValidityForm;

  static createTimingPlaceForm = CreateTimingPlaceForm;

  static priorityForm = PriorityForm;

  static reasonForChange = ReasonForChangeForm;

  static getPublicCodeInput() {
    return cy.getByTestId('StopFormComponent::publicCode');
  }

  static getPublicCodeCandidate(code: string) {
    return cy.getByTestId(`StopFormComponent::publicCode::candidate::${code}`);
  }

  static getPublicCodePrefixMissmatchWarning() {
    return cy.getByTestId(
      'ValidationError::message::PublicCodePrefixMissmatchWarning',
    );
  }

  static getStopAreaInput() {
    return cy.getByTestId('FindStopArea::input');
  }

  static getStopAreaResult(privateCode: string) {
    return cy.getByTestId(`FindStopArea::stopArea::${privateCode}`);
  }

  static getLongitudeInput() {
    return cy.getByTestId('StopFormComponent::longitude');
  }

  static getLatitudeInput() {
    return cy.getByTestId('StopFormComponent::latitude');
  }

  static getLocationFinInput() {
    return cy.getByTestId('StopFormComponent::locationFin');
  }

  static getLocationSweInput() {
    return cy.getByTestId('StopFormComponent::locationSwe');
  }

  static getTimingPlaceDropdown() {
    return cy.getByTestId('StopFormComponent::timingPlaceDropdown');
  }

  static getAddTimingPlaceButton() {
    return cy.getByTestId('StopFormComponent::addTimingPlaceButton');
  }

  static getModal() {
    return cy.getByTestId('EditStopModal');
  }

  static selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    StopForm.getTimingPlaceDropdown().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');
    cy.get('[role="option"]').contains(timingPlaceName).click();
  }

  static fillBaseForm(values: BaseStopFormInfo) {
    if (values.locationFin) {
      StopForm.getLocationFinInput().clearAndType(values.locationFin);
    }

    if (values.locationSwe) {
      StopForm.getLocationSweInput().clearAndType(values.locationSwe);
    }

    if (values.latitude) {
      StopForm.getLatitudeInput().clearAndType(values.latitude);
    }

    if (values.longitude) {
      StopForm.getLongitudeInput().clearAndType(values.longitude);
    }

    if (values.timingPlace) {
      StopForm.selectTimingPlace(values.timingPlace);
    }

    if (values.priority) {
      StopForm.priorityForm.setPriority(values.priority);
    }

    if (values.reasonForChange) {
      ReasonForChangeForm.getReasonForChangeInput().clearAndType(
        values.reasonForChange,
      );
    }

    ValidityPeriodForm.fillForm(values);
  }

  static fillFormForNewStop(values: NewStopFormInfo) {
    StopForm.getPublicCodeInput().clearAndType(values.publicCode);

    if (values.stopPlace) {
      StopForm.getStopAreaInput().clearAndType(values.stopPlace);
      StopForm.getStopAreaResult(values.stopPlace).click();
    }

    StopForm.fillBaseForm(values);
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  static save(forceAction = false) {
    return StopForm.getModal()
      .findByTestId('EditStopModal::saveButton')
      .click({ force: forceAction });
  }
}
