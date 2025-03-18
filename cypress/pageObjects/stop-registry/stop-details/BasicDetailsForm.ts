import { CreateTimingPlaceForm } from '../../CreateTimingPlaceForm';

export class BasicDetailsForm {
  createTimingPlaceForm = new CreateTimingPlaceForm();

  getAreaLink = () => cy.getByTestId('StopBasicDetailsForm::areaLink');

  getAreaPrivateCode = () =>
    cy.getByTestId('StopBasicDetailsForm::areaPrivateCode');

  getAreaQuays = () => cy.getByTestId('StopBasicDetailsForm::areaQuays');

  getAreaNameInput = () => cy.getByTestId('StopBasicDetailsForm::areaName');

  getAreaNameSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::areaNameSwe');

  getAreaNameLongInput = () =>
    cy.getByTestId('StopBasicDetailsForm::areaNameLong');

  getAreaNameLongSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::areaNameLongSwe');

  getAreaAbbreviationNameInput = () =>
    cy.getByTestId('StopBasicDetailsForm::areaAbbreviationName');

  getAreaAbbreviationNameSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::areaAbbreviationNameSwe');

  getLabelInput = () => cy.getByTestId('StopBasicDetailsForm::label');

  getPrivateCodeInput = () =>
    cy.getByTestId('StopBasicDetailsForm::privateCode');

  getNameFinInput = () => cy.getByTestId('StopBasicDetailsForm::nameFin');

  getNameSweInput = () => cy.getByTestId('StopBasicDetailsForm::nameSwe');

  getNameLongFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::nameLongFin');

  getNameLongSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::nameLongSwe');

  getLocationFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationFin');

  getLocationSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::locationSwe');

  getAbbreviationFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::abbreviationFin');

  getAbbreviationSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::abbreviationSwe');

  getAbbreviation5CharFinInput = () =>
    cy.getByTestId('StopBasicDetailsForm::abbreviation5CharFin');

  getAbbreviation5CharSweInput = () =>
    cy.getByTestId('StopBasicDetailsForm::abbreviation5CharSwe');

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
