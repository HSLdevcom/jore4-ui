import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';

export class LocationDetailsForm {
  static reasonForChange = ReasonForChangeForm;

  static getStreetAddressInput = () =>
    cy.getByTestId('LocationDetailsForm::streetAddress');

  static getPostalCodeInput = () =>
    cy.getByTestId('LocationDetailsForm::postalCode');

  static getMunicipalityReadOnly = () =>
    cy.getByTestId('LocationDetailsForm::municipality');

  static getFareZoneReadOnly = () =>
    cy.getByTestId('LocationDetailsForm::fareZone');

  static getLatitudeInput = () =>
    cy.getByTestId('LocationDetailsForm::latitude');

  static getLongitudeInput = () =>
    cy.getByTestId('LocationDetailsForm::longitude');

  static getAltitudeInput = () =>
    cy.getByTestId('LocationDetailsForm::altitude');

  static getFunctionalAreaInput = () =>
    cy.getByTestId('LocationDetailsForm::functionalArea');

  static getPlatformNumber = () =>
    cy.getByTestId('LocationDetailsForm::platformNumber');

  static getSignContentTypeDropdownButton = () =>
    cy.getByTestId('LocationDetailsForm::signContentType::ListboxButton');

  static getSignContentTypeDropdownOptions = () =>
    cy.getByTestId('LocationDetailsForm::signContentType::ListboxOptions');
}
