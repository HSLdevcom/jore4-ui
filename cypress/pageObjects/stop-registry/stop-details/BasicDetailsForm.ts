import { CreateTimingPlaceForm } from '../../CreateTimingPlaceForm';

export class BasicDetailsForm {
  createTimingPlaceForm = new CreateTimingPlaceForm();

  getLabelInput = () => cy.getByTestId('StopBasicDetailsForm::label');

  getPrivateCodeInput = () =>
    cy.getByTestId('StopBasicDetailsForm::privateCode');

  getLocationFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationFin');

  getLocationSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationSwe');

  getMainLineCheckbox = () => cy.getByTestId('StopBasicDetailsForm::mainLine');

  getInterchangeCheckbox = () =>
    cy.getByTestId('StopBasicDetailsForm::interchange');

  getRailReplacementCheckbox = () =>
    cy.getByTestId('StopBasicDetailsForm::railReplacement');

  getVirtualCheckbox = () => cy.getByTestId('StopBasicDetailsForm::virtual');

  getTransportModeDropdownButton = () =>
    cy.getByTestId('StopBasicDetailsForm::transportMode::ListboxButton');

  getTransportModeDropdownOptions = () =>
    cy.getByTestId('StopBasicDetailsForm::transportMode::ListboxOptions');

  getTimingPlaceDropdown = () =>
    cy.getByTestId('StopBasicDetailsForm::timingPlaceDropdown');

  getAddTimingPlaceButton = () =>
    cy.getByTestId('StopBasicDetailsForm::addTimingPlaceButton');

  getStopPlaceStateDropdownButton = () =>
    cy.getByTestId('StopBasicDetailsForm::stopPlaceState::ListboxButton');

  getStopPlaceStateDropdownOptions = () =>
    cy.getByTestId('StopBasicDetailsForm::stopPlaceState::ListboxOptions');

  getElyNumberInput = () => cy.getByTestId('StopBasicDetailsForm::elyNumber');
}
