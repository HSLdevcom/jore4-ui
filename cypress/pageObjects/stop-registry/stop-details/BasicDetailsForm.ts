import { CreateTimingPlaceForm } from '../../forms/CreateTimingPlaceForm';
import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';

export class BasicDetailsForm {
  static createTimingPlaceForm = CreateTimingPlaceForm;

  static reasonForChange = ReasonForChangeForm;

  static getLabelInput = () => cy.getByTestId('StopBasicDetailsForm::label');

  static getPrivateCodeInput = () =>
    cy.getByTestId('StopBasicDetailsForm::privateCode');

  static getLocationFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationFin');

  static getLocationSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationSwe');

  static getRailReplacementCheckbox = () =>
    cy.getByTestId('StopBasicDetailsForm::railReplacement');

  static getVirtualCheckbox = () =>
    cy.getByTestId('StopBasicDetailsForm::virtual');

  static getTransportModeDropdownButton = () =>
    cy.getByTestId('StopBasicDetailsForm::transportMode::ListboxButton');

  static getTransportModeDropdownOptions = () =>
    cy.getByTestId('StopBasicDetailsForm::transportMode::ListboxOptions');

  static getTimingPlaceDropdown = () =>
    cy.getByTestId('StopBasicDetailsForm::timingPlaceDropdown');

  static getAddTimingPlaceButton = () =>
    cy.getByTestId('StopBasicDetailsForm::addTimingPlaceButton');

  static getStopPlaceStateDropdownButton = () =>
    cy.getByTestId('StopBasicDetailsForm::stopPlaceState::ListboxButton');

  static getStopPlaceStateDropdownOptions = () =>
    cy.getByTestId('StopBasicDetailsForm::stopPlaceState::ListboxOptions');

  static getElyNumberInput = () =>
    cy.getByTestId('StopBasicDetailsForm::elyNumber');
}
